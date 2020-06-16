module WechatApi
  class Auth
    include HTTParty
    SESSION_URL = 'https://api.weixin.qq.com/sns/jscode2session'
    TOKEN_URL = 'https://api.weixin.qq.com/cgi-bin/token'

    def self.get_openid(code, app_id = nil)
      raise 'Missing Wechat Code' unless code
      body = {
        appid: get_app_id(app_id),
        secret: get_app_secret(app_id),
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
        session_key = parsed_json['session_key']
        [openid, unionid, session_key]
      else
        raise parsed_json['errmsg']
      end
    end

    def self.get_app_token(app_id = nil)
      query = {
        appid: get_app_id(app_id),
        secret: get_app_secret(app_id),
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

    def self.get_app_id(app_id)
      case app_id
      when 1, nil
        # Trashaus小程序
        id = ENV['WECHAT_APP_ID']
      when 2
        # 青山计划小程序
        id = ENV['QS_WECHAT_APP_ID']
      end
      id
    end

    def self.get_app_secret(app_id)
      case app_id
      when 1, nil
        # Trashaus小程序
        secret = ENV['QS_WECHAT_APP_SECRET']
      when 2
        # 青山计划小程序
        secret = ENV['QS_WECHAT_APP_SECRET']
      end
      secret
    end
  end
end
