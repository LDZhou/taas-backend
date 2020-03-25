class Api::BrandsController < ApiController
  before_action :check_admin, except: [:create]

  respond_to :json

   def index
     brands = Brand.all.order('created_at DESC')
     hash = BrandSerializer.new(brands).serializable_hash[:data]
     page = params[:page] || 1
     render json: { data: hash, count: brands.count, current_page: page }, status: :ok
   end

   def show
     brand = Brand.find_by_id(params[:id])
     if brand
       hash = BrandSerializer.new(brand).serializable_hash
       render json: hash, status: :ok
     else
       render json: { ec: 404, em: '无法找到该品牌' }, status: :not_found
     end
   end

   def create
     brand = Brand.create(brand_params)
     if brand.id
       if params[:brand][:license_photo_id]
         photo = Photo.where(id: params[:brand][:license_photo_id]).first
         photo.update_attributes(target_id: brand.id, target_type: 'Brand', photo_type: 'license') if photo
       end
       if params[:brand][:certificate_photo_ids]
         photo = Photo.where(id: params[:brand][:certificate_photo_ids]).first
         photo.update_attributes(target_id: brand.id, target_type: 'Brand', photo_type: 'certificate') if photo
       end
       hash = BrandSerializer.new(brand).serializable_hash
       render json: hash, status: :ok
     else
       render json: { ec: 400, em: brand.errors.full_messages[0] }, status: :not_found
     end
   end

   def update
     brand = Brand.find_by_id(params[:id])
     brand.update_attributes(brand_params)
     if params[:brand][:license_photo_id]
       photo = Photo.where(id: params[:brand][:license_photo_id]).first
       photo.update_attributes(target_id: brand.id, target_type: 'Brand', photo_type: 'license') if photo
     end
     if params[:brand][:certificate_photo_ids]
       ids = params[:brand][:certificate_photo_ids]
       photos = Photo.where(id: ids)
       photos.update_all(target_id: brand.id, target_type: 'Brand', photo_type: 'certificate') if photos.present?
     end
     if brand
       hash = BrandSerializer.new(brand).serializable_hash
       render json: hash, status: :ok
     else
       render json: { ec: 404, em: '找不到该品牌' }, status: :not_found
     end
   end

   def destroy
     brand = Brand.find_by_id(params[:id])
     if brand
       brand.destroy
       render json: {}, status: :ok
     else
       render json: { ec: 404, em: '无法找到该品牌' }, status: :not_found
     end
   end

   private
   def brand_params
     params.require(:brand).permit(:id, :brand_type, :name, :address, :city, :province, :contact_name,
                                   :contact_title, :contact_title, :contact_phone, :contact_email, :user_id)
   end
end
