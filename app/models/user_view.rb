class UserView < ApplicationRecord
  belongs_to :user
  belongs_to :target, polymorphic: true, optional: true
  before_save :tencent_geocode, if: Proc.new { |uv| uv.latitude_changed? || uv.longitude_changed?  }

  TENCENT_GEOCODE = {
      base_url: "http://apis.map.qq.com/ws/geocoder/v1/",
      key: ENV['TENCENT_API_KEY']
  }

  def tencent_geocode
    #return unless Rails.env.production?
    query_url = TENCENT_GEOCODE[:base_url] + "?location=#{latitude},#{longitude}" + '&key=' + TENCENT_GEOCODE[:key]
    res = HTTParty.get(URI.escape(query_url))
    if res['status'] == 0
      if res['result']['formatted_address']
        self.address = res['result']['formatted_address']['recommend'] || res['result']['address']
      else
        self.address = res['result']['address']
      end
      add = res['result']['address_component']
      self.street = add['street']
      self.street_no = add['street_number']
      self.city = add['city']
      self.district = add['district']
      self.province = add['province']
    else
      raise res['message']
    end
  end

  def created_at_formatted
    created_at.strftime("%Y-%m-%d %H:%M:%S")
  end
end
