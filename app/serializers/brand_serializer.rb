class BrandSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name, :brand_type, :brand_type, :address, :contact_name,
    :contact_title, :contact_phone, :contact_email, :business_license,
    :certificates

  attribute :created_at do |u|
    u.created_at_formatted
  end
end
