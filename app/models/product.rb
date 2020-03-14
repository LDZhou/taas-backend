class Product < ApplicationRecord
  belongs_to :brand

  has_many :photos, -> { order 'created_at DESC'  }, as: :target
  has_many :chains, -> { order 'created_at DESC'  }, as: :target

  def product_manual
    manual = photos.where(photo_type: 'manual').first
    if manual
      { id: manual.id, url: manual.file.url } 
    end
  end

  def created_at_formatted
    created_at.strftime("%Y-%m-%d %H:%M:%S")
  end

  def send_date_formatted
    send_date.strftime("%Y-%m-%d %H:%M:%S")
  end

  def deliver_date_formatted
    deliver_date.strftime("%Y-%m-%d %H:%M:%S")
  end
end
