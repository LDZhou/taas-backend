class Api::ChainsController < ApiController
  before_action :check_admin

  respond_to :json

   def index
     chains = Chain.all.order('created_at DESC')
     hash = ChainSerializer.new(chains).serializable_hash[:data]
     page = params[:page] || 1
     render json: { data: hash, count: chains.count, current_page: page }, status: :ok
   end

   def show
     chain = Chain.find_by_id(params[:id])
     if chain
       hash = ChainSerializer.new(chain).serializable_hash
       render json: hash, status: :ok
     else
       render json: { ec: 404, em: '无法找到该链条' }, status: :not_found
     end
   end

   def create
     chain = Chain.create(chain_params)
     if chain.id
       if params[:chain][:cover_photo_id]
         photo = Photo.where(id: params[:chain][:cover_photo_id]).first
         photo.update_attributes(target_id: chain.id, target_type: 'Chain', photo_type: 'cover_photo') if photo
       end
       if params[:chain][:share_photo_id]
         photo = Photo.where(id: params[:chain][:share_photo_id]).first
         photo.update_attributes(target_id: chain.id, target_type: 'Chain', photo_type: 'share_photo') if photo
       end
       if params[:chain][:product_ids]
         products = Product.where(id: params[:chain][:product_ids])
         products.each do |p|
           chain.chain_products.create(product: p)
         end
       end
       hash = ChainSerializer.new(chain).serializable_hash
       render json: hash, status: :ok
     else
       render json: { ec: 400, em: chain.errors.full_messages[0] }, status: :not_found
     end
   end

   def update
     chain = Chain.find_by_id(params[:id])
     if chain
			 chain.update_attributes(chain_params)
			 if params[:chain][:license_photo_id]
				 photo = Photo.where(id: params[:chain][:license_photo_id]).first
				 photo.update_attributes(target_id: chain.id, target_type: 'Chain', photo_type: 'license') if photo
			 end
			 if params[:chain][:certificate_photo_ids]
				 ids = params[:chain][:certificate_photo_ids]
				 photos = Photo.where(id: ids)
				 photos.update_all(target_id: chain.id, target_type: 'Chain', photo_type: 'certificate') if photos.present?
			 end
			 hash = ChainSerializer.new(chain).serializable_hash
			 render json: hash, status: :ok
     else
       render json: { ec: 404, em: '找不到该链条' }, status: :not_found
     end
   end

   def destroy
     chain = Chain.find_by_id(params[:id])
     if chain
       chain.destroy
			 render json: {}, status: :ok
     else
       render json: { ec: 404, em: '找不到该链条' }, status: :not_found
     end
   end

   private
   def chain_params
     params.require(:chain).permit(:id, :name)
   end
end
