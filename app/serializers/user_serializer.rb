class UserSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :nickname, :gender, :city, :slug, :admin, :email, :avatar, :age, :user_type, :authentication_token,
            :phone

  attribute :created_at do |u|
    u.created_at_formatted
  end

  attribute :date_of_birth do |u|
    u.date_of_birth_formatted
  end

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
end
