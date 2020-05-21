class ApiController < ActionController::API
  before_action :authenticate_request

  delegate :t, to: I18n

  attr_reader :current_user
  attr_reader :current_app

  private

  def authenticate_request
    @current_user = AuthorizeApiRequest.call(request.headers).result
    @current_app = AuthenticateApp.call(request.headers).result
    @admin_request = request.domain.match('admin') || params[:admin]
    if @current_user.nil? || (request.headers['Api-Key'] && @current_app.nil?)
      render json: { error: 'Not Authorized' }, status: 401
    end
  end

  def check_admin
    unless current_user.admin
      render json: { ec: 401, em: 'Not Authorized' }, status: :unauthorized and return
    end

    if current_user.brand_admin? && !request.get?
      render json: { ec: 401, em: 'Not Authorized' }, status: :unauthorized and return
    end
  end
end
