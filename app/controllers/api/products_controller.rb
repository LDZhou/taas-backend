class Api::ProductsController < ApiController
  before_action :check_admin, except: [:create, :update]

  respond_to :json

   def index
     products = Product.all.order('created_at DESC')
     hash = ProductSerializer.new(products).serializable_hash[:data]
     page = params[:page] || 1
     render json: { data: hash, count: products.count, current_page: page }, status: :ok
   end

   def show
     product = Product.find_by_id(params[:id])
     if product
       hash = ProductSerializer.new(product).serializable_hash
       render json: hash, status: :ok
     else
       render json: { ec: 404, em: '无法找到该产品' }, status: :not_found
     end
   end

   def create
     product = Product.create(product_params)
     if product.id
			 # Update photos
       if params[:product][:photo_ids]
         ids = params[:product][:photo_ids]
         photos = Photo.where(id: ids)
         photos.update_all(target_id: product.id, target_type: 'Product') if photos.present?
       end
       if params[:product][:product_manual_id]
         id = params[:product][:product_manual_id]
         photo = Photo.find_by_id(id)
         photo.update_attributes(target_id: product.id, target_type: 'Product', photo_type: 'manual') if photo
       end
       hash = ProductSerializer.new(product).serializable_hash
       render json: hash, status: :ok
     else
       render json: { ec: 400, em: product.errors.full_messages[0] }, status: :not_found
     end
   end

   def update
     product = Product.find_by_id(params[:id])
     if product
       product.update_attributes(product_params)
       # Update photos
       if params[:product][:photo_ids]
         ids = params[:product][:photo_ids]
         existing_ids = product.photos.pluck(:id)
         # If photo ids are different, meaning photos has been add/delete in the frontend
         # then reset all the existing photos first
         if ids.sort != existing_ids.sort
           product.photos.update_all(target_id: nil, target_type: nil)
           photos = Photo.where(id: ids)
           photos.update_all(target_id: product.id, target_type: 'Product') if photos.present?
         end
       end
       if params[:product][:product_manual_id]
         id = params[:product][:product_manual_id]
         photo = Photo.find_by_id(id)
         photo.update_attributes(target_id: product.id, target_type: 'Product', photo_type: 'manual') if photo
       end
       hash = ProductSerializer.new(product).serializable_hash
       render json: hash, status: :ok
     else
       render json: { ec: 404, em: '找不到该产品' }, status: :not_found
     end
   end

   def destroy
     product = Product.find_by_id(params[:id])
     if product
       product.destroy
       render json: {}, status: :ok
     else
       render json: { ec: 404, em: '无法找到该产品' }, status: :not_found
     end
   end

   private
   def product_params
     params.require(:product).permit(:id, :brand_id, :wastage_percent, :additive_percent, :name, :model, :size, :weight,
                        :quantity, :material, :material_percent, :pkg_name, :pkg_quantity, :sender_name, :sender_address,
                        :receiver_name, :receiver_address, :shipping_company, :shipping_no, :product_manual, :manufactured_at,
                        :send_date, :deliver_date)
   end
end
