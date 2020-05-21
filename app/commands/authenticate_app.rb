class AuthenticateApp
  prepend SimpleCommand

  def initialize(headers = {})
    @headers = headers
  end

  def call
    app
  end

  private

  attr_reader :headers

  def app
    @app ||= Application.find_by_id(decoded_api_key[:app_id]) if decoded_api_key
    @app || errors.add(:api_key, 'Invalid api_key') && nil
  end

  def decoded_api_key
    @decoded_auth_token ||= JsonWebToken.decode(http_auth_header)
  end

  def http_auth_header
    if headers['Api-Key'].present?
      return headers['Api-Key'].split(' ').last
    else
      errors.add(:api_key, 'Missing api_key')
    end
    nil
  end
end
