class Application < ApplicationRecord
  after_create :set_api_key

  def set_api_key
    exp = Time.now.to_i + 3600 * 24 * 365 * 100
    self.authentication_token = JsonWebToken.encode({ user_id: id, exp: exp })
    save
  end
end
