class Chain < ApplicationRecord
  paginates_per 20

  has_many :chain_products, -> { order('index ASC') }
  has_many :photos, -> { order 'created_at DESC'  }, as: :target

  def created_at_formatted
    created_at.strftime("%Y-%m-%d %H:%M:%S")
  end

  def final_product
    cp = chain_products.last
    if cp && cp.product
      cp.product
    end
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
end
