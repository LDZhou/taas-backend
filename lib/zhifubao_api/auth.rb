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
      res = JSON.parse res
      if res["alipay_system_oauth_token_response"] && res["alipay_system_oauth_token_response"]["access_token"]
        token = res["alipay_system_oauth_token_response"]["access_token"]
        userid = res["alipay_system_oauth_token_response"]["user_id"]
      else
        raise res["error_response"]["sub_msg"]
      end
      [userid, token]
    end

    def self.generate_qr_code(options)
      case options[:type]
      when 'chain'
        filename = "qr_code_#{options[:value]}.png"
      end
			@alipay_client = Alipay::Client.new(
				url: BASE_URL,
				app_id: APP_ID,
				app_private_key: APP_PRIVATE_KEY,
				alipay_public_key: ALIPAY_PUBLIC_KEY,
				charset: 'utf-8'
			)
			res = @alipay_client.execute(
        method: 'alipay.open.app.qrcode.create',
        biz_content: JSON.generate({
          url_param: 'pages/solution/retrospect/retrospect',
          query_param: "app_id=#{options[:value]}",
          describe: '小程序二维码'
        }, ascii_only: true)
      )
      res = JSON.parse res
      if res["alipay_open_app_qrcode_create_response"] && res["alipay_open_app_qrcode_create_response"]["code"] == "10000"
        file = File.open("public/#{filename}", "wb")
        file.write(res["alipay_open_app_qrcode_create_response"]["qr_code_url"])
        file
      else
        raise res["alipay_open_app_qrcode_create_response"]["sub_msg"]
      end
    end
  end
end
