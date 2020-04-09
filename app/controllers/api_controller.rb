class ApiController < ActionController::API
  before_action :authenticate_request
  before_action :update_user_location

  delegate :t, to: I18n

  attr_reader :current_user

  def update_user_location
    if current_user
      current_user.update_tracked_fields!(request)
      if params[:latitude].present? && params[:longitude].present?
        current_user.update_attributes latitude: params[:latitude], longitude: params[:longitude]
      end
    end
  end

  private

  def authenticate_request
    @current_user = AuthorizeApiRequest.call(request.headers).result
    @admin_request = request.domain.match('admin') || params[:admin]
    render json: { error: 'Not Authorized' }, status: 401 unless @current_user
  end

  def check_admin
    unless current_user.admin
      render json: { ec: 401, em: 'Not Authorized' }, status: :unauthorized and return
    end
  end
end
