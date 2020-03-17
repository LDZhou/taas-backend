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
      user.really_destroy! if user
    end
    user.openid = openid if openid && user.openid.nil?
    user.email = params[:user][:email] if params[:user][:email].present? && user.email.nil?
    user.nickname = params[:user][:nickname] if params[:user][:nickname].present? && user.nickname.nil?
    user.city = params[:user][:city] if params[:user][:city].present? && user.city.nil?
    user.province = params[:user][:province] if params[:user][:province].present? && user.province.nil?
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

  def update
    if @admin_request
      user = User.find_by_id(params[:id])
    else
      user = current_user
    end
    if user
      user.update_attributes(user_params)
      if user.errors.present?
        render json: { ec: 400, em: user.errors.full_messages[0] }, status: :bad_request
      else
        hash = UserSerializer.new(user.reload).serializable_hash
        render json: hash, status: :ok
      end
    else
      render json: { ec: 404, em: '无法找到该用户' }, status: :not_found
    end
  end

  def show
    if @admin_request
      user = User.find_by_id(params[:id])
    else
      user = current_user
    end
    if user
      hash = UserSerializer.new(user).serializable_hash
      render json: hash, status: :ok
    else
      render json: { ec: 404, em: '无法找到该用户' }, status: :not_found
    end
  end

  def upload_photo
    if @admin_request
      user = User.find_by_id(params[:id])
    else
      user = current_user
    end
    if user
      if params[:photo] && params[:photo_type]
        case params[:photo_type]
        when 'avatar'
          photo = Photo.compose(user, 'avatar', nil)
        end
        photo.file = params[:photo]
        photo.save
      end
      hash = UserSerializer.new(user).serializable_hash
      render json: hash, status: :ok
    else
      render json: { ec: 404, em: '无法找到该用户' }, status: :not_found
    end
  end

  private
  def user_params
    params.require(:user).permit(:nickname, :phone, :email, :gender, :city, :province, :district, :admin)
  end
end
