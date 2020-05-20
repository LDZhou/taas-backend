class BrandSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name, :brand_type, :brand_type, :address, :contact_name,
    :contact_title, :contact_phone, :contact_email, :city, :province, :business_license,
    :certificates, :user_id, :app_id

  attribute :created_at do |b|
    b.created_at_formatted
  end

  attribute :app_name do |b|
    b.application&.name || ''
  end
end
