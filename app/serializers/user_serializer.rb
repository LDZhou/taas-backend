class UserSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :nickname, :gender, :city, :slug, :admin, :email, :avatar

  attribute :created_at do |u|
    u.created_at_formatted
  end
end
