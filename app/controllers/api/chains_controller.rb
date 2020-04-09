class Api::ChainsController < ApiController
  skip_before_action :authenticate_request, only: [:show]
  before_action :check_admin, except: [:show]

  respond_to :json

   def index
     chains = Chain.all.order('created_at DESC')
     hash = ChainSerializer.new(chains).serializable_hash[:data]
     page = params[:page] || 1
     render json: { data: hash, count: chains.count, current_page: page }, status: :ok
   end

   def show
     chain = Chain.find_by_id(params[:id])
     current_user = AuthorizeApiRequest.call(request.headers).result
     if chain
       if current_user && params[:scan_code]
         update_user_location
         current_user.user_views.create(target: chain, latitude: params[:latitude], longitude: params[:longitude])
       end
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
			 if params[:chain][:cover_photo_id]
				 photo = Photo.where(id: params[:chain][:cover_photo_id]).first
				 photo.update_attributes(target_id: chain.id, target_type: 'Chain', photo_type: 'cover_photo') if photo
			 end
			 if params[:chain][:share_photo_id]
				 id = params[:chain][:share_photo_id]
				 photo = Photo.find_by_id(id)
				 photo.update_attributes(target_id: chain.id, target_type: 'Chain', photo_type: 'share_photo') if photo
			 end
       if params[:chain][:product_ids]
         ids = params[:chain][:product_ids]
         existing_ids = chain.chain_products.pluck(:product_id)
         if ids.sort != existing_ids.sort
           chain.chain_products.destroy_all
           ids.each_with_index do |product_id,i|
             product = Product.find_by_id(product_id)
             chain.chain_products.create(product: product, index: i + 1)
           end
         end
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
