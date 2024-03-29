class Api::ChainsController < ApiController
  skip_before_action :authenticate_request, only: [:show, :app_index]
  before_action :check_admin, except: [:show, :app_index]

  respond_to :json

  def index
    page = params[:page] || 1
    chains = if current_user.brand_admin?
               c_ids = []
               current_user.brands.each do |brand|
                 c_ids.concat(brand.chain_ids)
               end
               Chain.where(id: c_ids).order('created_at DESC').page(page)
             else
               Chain.all.order('created_at DESC').page(page)
             end
    hash = ChainSerializer.new(chains).serializable_hash[:data]
    render json: { data: hash, count: chains.count, current_page: page }, status: :ok
  end

  def app_index
    if @app_id
      chains = Chain.where(app_id: @app_id).order('created_at DESC')
      hash = ChainSerializer.new(chains).serializable_hash[:data]
      render json: { data: hash }, status: :ok
    else
      render json: { ec: 404, em: '无法找到链条' }, status: :not_found
    end
  end

  def show
    chain = Chain.find_by_id(params[:id])
    current_user = AuthorizeApiRequest.call(request.headers).result
    if chain
      if current_user && @app_id
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
        products = params[:chain][:product_ids]
        products.each_with_index do |p_id, i|
          p = Product.find_by_id(p_id)
          chain.chain_products.create(product: p, index: i + 1) if p
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
            chain.chain_products.create(product: product, index: i + 1) if product
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
    params.require(:chain).permit(:id, :name, :app_id, :reduce_volume, :reduce_power, :reduce_co2)
  end
end
