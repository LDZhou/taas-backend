module WechatApi
  class QrCode
    include HTTParty
    BASE_URL = 'https://api.weixin.qq.com/wxa/getwxacode'
    NORMAL_CODE_BASE_URL = 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode'
    BASE_PATH = 'pages/solution/retrospect/retrospect'

    def self.generate_qr_code(options)
      case options[:type]
      when 'chain'
        filename = "qr_code_#{options[:value]}.png"
        width = 1200
      end
      params = "id=#{options[:value]}"
      token = WechatApi::Auth.get_app_token(options[:app_id])
      query = { access_token: token }
      body = { path: "#{BASE_PATH}?#{params}&scan_code=true", width: width }.to_json.gsub!(/\\u([a-f0-9]{4,5})/i){ [$1.hex].pack('U') } 
      res = HTTParty.post(NORMAL_CODE_BASE_URL, { body: body, query: query })
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
