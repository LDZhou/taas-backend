class ApiController < ActionController::API
  before_action :set_current_user
  before_action :authenticate_request, except: [:configs]
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

  def configs
    hash = {
    }
    render json: hash, statue: :ok
  end

  private

  def set_current_user
    @current_user = AuthorizeApiRequest.call(request.headers).result
  end

  def authenticate_request
    render json: { error: 'Not Authorized' }, status: 401 unless @current_user
  end
end
