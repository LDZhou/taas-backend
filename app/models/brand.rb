class Brand < ApplicationRecord
  belongs_to :user
  has_many :products, -> { order 'created_at DESC'  }

  def business_license
    photo = photos.where(photo_type: 'license').first
    if photo
      { id: photo.id, url: photo.file.url }
    end
  end

  def certificates
    arr = []
    photos = photos.where(photo_type: 'certificate')
    if photos.present?
      photos.each do |photo|
        arr << { id: photo.id, url: photo.file.url }
      end
    end
    arr
  end
end
