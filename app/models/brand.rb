class Brand < ApplicationRecord
  paginates_per 20

  belongs_to :user, optional: true
  belongs_to :app, class_name: 'Application', foreign_key: :app_id, optional: true
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
    # 1. Find all chains
    c_ids = chain_ids
    # 2. Find all user_views that related to the chains
    UserView.where(target_type: 'Chain', target_id: c_ids)
  end

  def chain_ids
    # 1. Find all products
    p_ids = products.pluck(:id)
    # 2. Find all chains that have those products
    ChainProduct.where(product_id: p_ids).pluck(:chain_id).uniq
  end

  def chains
    Chain.where(id: chain_ids)
  end

  def gender_ratio
    views = total_views
    ids = views.pluck(:user_id)
    users = User.where(id: ids)
    male = users.where(gender: 0).count
    female = users.where(gender: 1).count
    if male > 0 && female > 0
      "#{male}:#{female}"
    else
      "1:1"
    end
  end
end
