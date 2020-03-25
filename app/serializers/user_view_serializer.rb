class UserViewSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :address, :city, :province, :street, :street_no

  attribute :chain do |uv|
    chain = uv.target
    if chain
      ChainSerializer.new(chain).serializable_hash[:data]
    end
  end

  attribute :product_name do |uv|
    p = uv.target.final_product rescue nil
    p.name if p
  end

  attribute :product_id do |uv|
    p = uv.target.final_product rescue nil
    p.id if p
  end
end
