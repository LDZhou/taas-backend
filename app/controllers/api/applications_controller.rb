class Api::ApplicationsController < ApiController
  before_action :check_admin

  respond_to :json

  def create
    unless params[:app] && params[:app][:name]
      return render json: { ec: 400, em: 'name 不能为空' }, status: :bad_request
    end

    app = Application.find_by_name params[:app][:name]
    unless app.nil?
      return render json: { ec: 400, em: 'app 已存在' }, status: :bad_request
    end

    app = Application.create app_params
    hash = ApplicationSerializer.new(app).serializable_hash
    render json: hash, status: :created
  end

  def update
    app = Application.find_by_name params[:app][:name]
    unless app.nil?
      return render json: { ec: 400, em: '已存在相同name的app' }, status: :bad_request
    end

    app = Application.find_by_id params[:id]
    unless app
      return render json: { ec: 404, em: '未找到 app' }, status: :not_found
    end

    app.update_attributes app_params

    render json: {}, status: :ok
  end

  def index
    apps = Application.all.order('created_at ASC')
    hash = ApplicationSerializer.new(apps).serializable_hash
    render json: hash, status: :ok
  end

  def redirect_app
  end

  private

  def app_params
    params.require(:app).permit(:name)
  end
end
