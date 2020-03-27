class Product < ApplicationRecord
  paginates_per 20

  belongs_to :brand

  has_many :photos, -> { order 'created_at DESC'  }, as: :target
  has_many :chains, -> { order 'created_at DESC'  }, as: :target
  has_many :user_views, -> { order 'created_at DESC'  }, as: :target

  def product_manual
    manual = photos.where(photo_type: 'manual').first
    if manual
      { id: manual.id, url: manual.file.url } 
    end
  end

  def brand_name
    brand.name if brand
  end

  def created_at_formatted
    created_at.strftime("%Y-%m-%d %H:%M:%S")
  end

  def manufactured_at_formatted
    manufactured_at.strftime("%Y-%m-%d %H:%M:%S") if manufactured_at
  end

  def send_date_formatted
    send_date.strftime("%Y-%m-%d %H:%M:%S") if send_date
  end

  def deliver_date_formatted
    deliver_date.strftime("%Y-%m-%d %H:%M:%S") if deliver_date
  end
end
