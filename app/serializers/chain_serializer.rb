class ChainSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name, :cover_photo, :share_photo, :qr_code, :total_views

  attribute :created_at do |c|
    c.created_at_formatted
  end

  attribute :products do |c|
    products = c.chain_products.collect(&:product).compact
    ProductSerializer.new(products).serializable_hash[:data]
  end
end
