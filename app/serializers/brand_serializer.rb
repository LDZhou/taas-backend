class BrandSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name, :brand_type, :brand_type, :address, :contact_name,
    :contact_title, :contact_phone, :contact_email, :city, :province, :business_license,
    :certificates, :user_id

  attribute :created_at do |b|
    b.created_at_formatted
  end
end
