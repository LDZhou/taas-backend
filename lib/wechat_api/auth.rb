module WechatApi
  class Auth
    include HTTParty
    SESSION_URL = 'https://api.weixin.qq.com/sns/jscode2session'
    TOKEN_URL = 'https://api.weixin.qq.com/cgi-bin/token'
    ID = ENV['WECHAT_APP_ID']
    SECRET = ENV['WECHAT_APP_SECRET']

    def self.get_openid(code)
      raise 'Missing Wechat Code' unless code
      body = {
        appid: ID,
        secret: SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
      res = HTTParty.post(SESSION_URL, { body: body })
      parsed_json = JSON.parse res
      Rails.logger.debug "Wechat Auth Res: #{parsed_json}"
      if res.code == 200
        openid = parsed_json['openid']
        raise 'No user' unless openid
        unionid = parsed_json['unionid']
        openid
      else
        raise parsed_json['errmsg']
      end
    end

    def self.get_app_token
      query = {
        appid: ID,
        secret: SECRET,
        grant_type: 'client_credential'
      }
      res = HTTParty.get(TOKEN_URL, { query: query })
      if res.code == 200
        token = res['access_token']
        raise 'No token' unless token
        token
      else
        raise res['errmsg']
      end
    end
  end
end
