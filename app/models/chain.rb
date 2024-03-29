require 'wechat_api'

class Chain < ApplicationRecord
  paginates_per 20

  belongs_to :app, class_name: 'Application', foreign_key: :app_id, optional: true
  has_many :chain_products, -> { order('index ASC') }
  has_many :photos, -> { order 'created_at DESC'  }, as: :target
  has_many :user_views, -> { order 'created_at DESC'  }, as: :target

  after_create :generate_qr_code

  def created_at_formatted
    created_at.strftime("%Y-%m-%d %H:%M:%S")
  end

  def final_product
    cp = chain_products.last
    if cp && cp.product
      cp.product
    end
  end

  def total_views
    user_views.count
  end

  def cover_photo
    photo = photos.where(photo_type: 'cover_photo').first
    if photo
      { id: photo.id, url: photo.file.url  }
    end
  end

  def share_photo
    photo = photos.where(photo_type: 'share_photo').first
    if photo
      { id: photo.id, url: photo.file.url  }
    end
  end

  def qr_code
    photo = photos.where(photo_type: 'qr_code').first
    if photo
      { id: photo.id, url: photo.file.url  }
    end
  end

  def generate_qr_code
    photo = photos.where(photo_type: 'qr_code').first
    unless photo
      options = { type: 'chain', value: id, app_id: app_id }
      begin
        if app_id == 4
          file = ZhifubaoApi::Auth.generate_qr_code(options)
        else
          file = WechatApi::QrCode.generate_qr_code(options)
        end
        photo = Photo.compose(self, 'qr_code', nil, file)
      rescue
      end
    end
    photo
  end
end
