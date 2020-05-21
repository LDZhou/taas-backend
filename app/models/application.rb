class Application < ApplicationRecord
  after_create :set_api_key

  def set_api_key
    exp = Time.now.to_i + 3600 * 24 * 365 * 100
    self.api_key = JsonWebToken.encode({ app_id: id, exp: exp })
    save
  end
end
