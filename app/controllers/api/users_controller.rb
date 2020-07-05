require 'wechat_api'
require 'zhifubao_api'

class Api::UsersController < ApiController
  skip_before_action :authenticate_request, only: [:admin_login, :login]
  before_action :check_admin, only: [:index]

  respond_to :json

  def admin_login
    user = User.where(email: params[:user][:email]).first
    if user && user.valid_password?(params[:user][:password])
      if user.admin
        hash = UserSerializer.new(user).serializable_hash
        render json: hash, status: :ok
      else
        render json: { ec: 401, em: '对不起，您无权登录。' }, status: :unauthorized
      end
    else
      render json: { ec: 401, em: '用户名或密码错误。' }, status: :unauthorized
    end
  end

  def login
    begin
      if Rails.env.test?
        openid = '12345'
      else
        Rails.logger.debug "Start WechatApi: #{Time.now}"
        Rails.logger.debug "Api-Key: #{@api_key}"
        Rails.logger.debug "AppID: #{@app_id}"
        if @app_id == 4
          source = 'zhifubao'
          # 支付宝小程序
          unionid = nil
          openid, token = ZhifubaoApi::Auth.get_openid(params[:user][:zhifubao_code])
          params[:nickname] = params[:nickName] if params[:nickName].present?
          params[:avatarUrl] = params[:avatar] if params[:avatar].present?
        else
          source = 'wechat'
          # 微信小程序
          openid, unionid, session_key = WechatApi::Auth.get_openid(params[:user][:wechat_code], @app_id)
        end
        Rails.logger.debug "Openid: #{openid}"
      end
    rescue => e
      e.message
      render json: { ec: 401, em: e.message }, status: :unauthorized and return
    end
    begin
      user = User.unscoped.where(openid: openid).first_or_create
    rescue => e
      user = User.unscoped.where(openid: openid).first
      user.destroy if user
    end
    user.openid = openid if openid && user.openid.nil?
    user.unionid = unionid if unionid
    user.email = params[:user][:email] if params[:user][:email].present? && user.email.nil?
    user.nickname = params[:user][:nickname] if params[:user][:nickname].present? && user.nickname.nil?
    user.city = params[:user][:city] if params[:user][:city].present? && user.city.nil?
    # Register source: wechat/zhifubao
    user.source = source
    # For WeChat, 0: Unknown, 1: Male, 2: Female
    gender = case params[:user][:gender].to_s
             when '0' then nil
             when '1', 'm' then 0
             when '2', 'f' then 1
             end
    user.gender = gender unless user.gender
    if params[:user][:avatarUrl] && user.photos.empty?
      Photo.compose(user, 'avatar', params[:user][:avatarUrl])
    end
    if user.save
      hash = UserSerializer.new(user).serializable_hash
      render json: hash, status: :ok
    else
      render json: { ec: 401, em: user.errors.full_messages[0] }, status: :unauthorized
    end
  end

  def index
    page = params[:page] || 1
    users = if current_user.brand_admin?
              total_views = []
              current_user.brands.each do |brand|
                total_views.concat(brand.total_views)
              end
              ids = total_views.pluck(:user_id).uniq
              User.where(id: ids).order('created_at DESC').page(page)
            else
              User.all.order('created_at DESC').page(page)
            end
    count = users.total_count
    json = UserSerializer.new(users).serializable_hash[:data]
    render json: { data: json, count: count, current_page: page }, status: :ok
  end

  def update
    if @admin_request
      user = User.find_by_id(params[:id])
      options = { scope: { show_view: true } }
    else
      user = current_user
      options = {}
    end
    if user
      user.update_attributes(user_params)
      if user.errors.present?
        render json: { ec: 400, em: user.errors.full_messages[0] }, status: :bad_request
      else
        hash = UserSerializer.new(user, options).serializable_hash
        render json: hash, status: :ok
      end
    else
      render json: { ec: 404, em: '无法找到该用户' }, status: :not_found
    end
  end

  def show
    if @admin_request
      user = User.find_by_id(params[:id])
      options = { scope: { show_view: true } }
    else
      user = current_user
      options = {}
    end
    if user
      hash = UserSerializer.new(user, options).serializable_hash
      render json: hash, status: :ok
    else
      render json: { ec: 404, em: '无法找到该用户' }, status: :not_found
    end
  end

  def view
    chain = Chain.find_by_id(params[:chain_id])
    if chain
      current_user.user_views.create(target: chain)
    end
    render json: {}, status: :ok
  end

  def review
    Review.create user: current_user, name: params[:name], email: params[:email], body: params[:body]
    render json: {}, status: :ok
  end

  private
  def user_params
    params.require(:user).permit(:nickname, :email, :phone, :gender, :city, :admin, :user_type, :date_of_birth, :password, :name, :notes)
  end
end
