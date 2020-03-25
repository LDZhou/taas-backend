class Api::PhotosController < ApiController
  before_action :check_admin

  respond_to :json

  def create
    photo = Photo.create(file: params[:photo], photo_type: params[:photo_type])
    if photo.id
      render json: { id: photo.id, url: photo.file.url }, status: :created
    else
      render json: { ec: 400, em: '上传文件失败，请重试' }, status: :bad_request
    end
  end
end
