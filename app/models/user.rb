class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable

  has_many :photos, -> { order 'created_at DESC'  }, as: :target
  has_many :brands, -> { order 'created_at DESC'  }

  DEFAULT_PHOTO = "https://kems-1256104336.file.myqcloud.com/production/assets/blank-profile-picture.png"

  def avatar
    photo = photos.where(photo_type: 'avatar').first
    if photo
      photo.file.url
    else
      DEFAULT_PHOTO
    end
  end
end
