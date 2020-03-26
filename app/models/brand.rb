class Brand < ApplicationRecord
  paginates_per 20

  belongs_to :user, optional: true
  has_many :products, -> { order 'created_at DESC'  }
  has_many :photos, -> { order 'created_at DESC'  }, as: :target

  def created_at_formatted
    created_at.strftime("%Y-%m-%d %H:%M:%S")
  end

  def business_license
    photo = photos.where(photo_type: 'license').first
    if photo
      { id: photo.id, url: photo.file.url }
    end
  end

  def certificates
    arr = []
    certs = photos.where(photo_type: 'certificate')
    if certs.present?
      certs.each do |photo|
        arr << { id: photo.id, url: photo.file.url }
      end
    end
    arr
  end

  def total_views
    # 1. Find all products
    p_ids = products.pluck(:id)
    # 2. Find all chains that have those products
    c_ids = ChainProduct.where(product_id: p_ids).pluck(:id).uniq
    # 3. Find all user_views that related to the chains
    views = UserView.where(target_type: 'Chain', target_id: c_ids)
    views
  end
end
