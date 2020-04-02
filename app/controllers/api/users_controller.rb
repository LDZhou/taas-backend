require 'wechat_api'

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
        openid = WechatApi::Auth.get_openid(params[:user][:wechat_code])
        Rails.logger.debug "Openid: #{openid}"
        Rails.logger.debug "Finish WechatApi: #{Time.now}"
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
    user.email = params[:user][:email] if params[:user][:email].present? && user.email.nil?
    user.nickname = params[:user][:nickname] if params[:user][:nickname].present? && user.nickname.nil?
    user.city = params[:user][:city] if params[:user][:city].present? && user.city.nil?
    # For WeChat, 0: Unknown, 1: Male, 2: Female
    gender = case params[:user][:gender].to_i
             when 0 then nil
             when 1 then 0
             when 2 then 1
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
		user = User.all.order('created_at DESC').page(page)
    count = user.total_count
    json = UserSerializer.new(user).serializable_hash[:data]
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

  private
  def user_params
    params.require(:user).permit(:nickname, :email, :phone, :gender, :city, :admin, :user_type, :date_of_birth, :password)
  end
end
