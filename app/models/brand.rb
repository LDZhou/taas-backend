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
end
