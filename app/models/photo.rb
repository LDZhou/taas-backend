class Photo < ApplicationRecord
  mount_uploader :file, PhotoUploader
  belongs_to :target, polymorphic: true, optional: true

  scope :video, -> { where(photo_type: 'video') }
  scope :avatar, -> { where(photo_type: 'avatar')  }

  def self.compose(target, photo_type, photo_url, file = nil)
    user_photo = new(target: target)
    user_photo.photo_type = photo_type
    user_photo.remote_file_url = photo_url if photo_url
    user_photo.file = file if file
    user_photo.save!
    user_photo
  end

  def url
    file.url if file
  end

  def thumb_url
    file.thumb.url if file
  end
end
