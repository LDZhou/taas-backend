class CreateAuthToken
  prepend SimpleCommand

  def initialize(email)
    @email = email
  end

  def call
    JsonWebToken.encode(user_id: user.id) if user
  end

  private

  attr_accessor :email

  def user
    user = User.where(email: email).first
    return user if user
    errors.add :user_authentication, 'invalid credentials'
    nil
  end
end
