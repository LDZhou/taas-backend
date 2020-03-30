module WechatApi
  class QrCode
    include HTTParty
    BASE_URL = 'https://api.weixin.qq.com/wxa/getwxacode'
    BASE_PATH = 'pages/index/chain'

    def self.generate_qr_code(options)
      case options[:type]
      when 'chain'
        filename = "qr_code_#{options[:value]}.png"
        width = 15
      end
      params = "id=#{options[:value]}"
      token = WechatApi::Auth.get_app_token
      query = { access_token: token }
      body = { path: "#{BASE_PATH}?#{params}", width: width }.to_json
      res = HTTParty.post(BASE_URL, { body: body, query: query })
      if res.code == 200
        file = File.open("public/#{filename}", "wb")
        file.write(res)
        file
      else
        raise res['errmsg']
      end
    end
  end
end