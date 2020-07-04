module ZhifubaoApi
  class Auth
    include HTTParty
    BASE_URL = 'https://openapi.alipay.com/gateway.do'
    APP_ID = ENV['ZHIFUBAO_ELEMA_APP_ID']
    APP_PRIVATE_KEY = ENV['ZHIFUBAO_ELEMA_APP_PRIVATE_KEY']
    ALIPAY_PUBLIC_KEY = ENV['ZHIFUBAO_ELEMA_ALIPAY_PUBLIC_KEY']

    def self.get_userid(code)
			@alipay_client = Alipay::Client.new(
				url: BASE_URL,
				app_id: APP_ID,
				app_private_key: APP_PRIVATE_KEY,
				alipay_public_key: ALIPAY_PUBLIC_KEY,
				charset: 'utf-8'
			)
			res = @alipay_client.execute(
				method: 'alipay.system.oauth.token',
        grant_type: 'authorization_code',
        code: code
			)
      [openid, token]

      #res = HTTParty.get(TOKEN_URL, { query: query })
      #if res.code == 200
      #  token = res['access_token']
      #  raise 'No token' unless token
      #  token
      #else
      #  raise res['errmsg']
      #end
    end
  end
end
