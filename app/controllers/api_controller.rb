class ApiController < ActionController::API
  before_action :authenticate_app
  before_action :authenticate_request

  delegate :t, to: I18n

  attr_reader :current_user
  attr_reader :current_app

  private

  def authenticate_app
    @api_key = request.headers['Api-Key']
    if @api_key.present?
      @app_id = Application.find_by_api_key(@api_key)
    else
      @app_id = nil
    end
  end

  def authenticate_request
    @current_user = AuthorizeApiRequest.call(request.headers).result
    @current_app = AuthenticateApp.call(request.headers).result
    @admin_request = request.domain.match('admin') || params[:admin]
    @current_app ||= Application.where(name: 'trashaus').first
    render json: { error: 'Not Authorized' }, status: 401 unless @current_user
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
