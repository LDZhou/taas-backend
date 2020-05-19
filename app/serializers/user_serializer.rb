class UserSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :nickname, :gender, :city, :slug, :admin, :email, :avatar, :age, :user_type, :authentication_token,
            :phone

  attribute :created_at, &:created_at_formatted

  attribute :date_of_birth, &:date_of_birth_formatted

  attribute :user_views do |u|
    if scope && scope[:show_view]
      views = u.user_views
      UserViewSerializer.new(views).serializable_hash[:data]
    end
  end

  attribute :brand do |u|
    brand = u.brands.first
    if u.user_type == 1 && brand
      { product_count: brand.products.count, name: brand.name, total_views: brand.total_views.count, ratio: brand.gender_ratio }
    end
  end

  attribute :brand_admin, &:brand_admin?
end
