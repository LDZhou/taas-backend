class ProductSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :brand_id, :wastage_percent, :additive_percent, :name, :model, :size, :weight,
    :quantity, :material, :material_percent, :pkg_name, :pkg_quantity, :sender_name, :sender_address,
    :receiver_name, :receiver_address, :shipping_company, :shipping_no, :product_manual

  attribute :created_at do |p|
    p.created_at_formatted
  end

  attribute :send_date do |p|
    p.send_date_formatted
  end

  attribute :deliver_date do |p|
    p.deliver_date_formatted
  end

  attribute :photos do |p|
    arr = []
    photos = p.photos.where(photo_type: nil)
    photos.each do |photo|
      arr << { id: photo.id, url: photo.file.url }
    end
    arr
  end
end
