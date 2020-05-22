class ChainSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name, :cover_photo, :share_photo, :qr_code, :total_views, :app_id

  attribute :created_at, &:created_at_formatted

  attribute :products do |c|
    products = c.chain_products.collect(&:product).compact
    ProductSerializer.new(products).serializable_hash[:data]
  end

  attribute :app_name do |b|
    b.app&.name || ''
  end
end
