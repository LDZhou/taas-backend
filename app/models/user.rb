class User < ApplicationRecord
  paginates_per 20

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable

  has_many :photos, -> { order 'created_at DESC'  }, as: :target
  has_many :brands, -> { order 'created_at DESC'  }
  has_many :user_views, -> { order 'created_at DESC'  }

  DEFAULT_PHOTO = "https://kems-1256104336.file.myqcloud.com/production/assets/blank-profile-picture.png"

  validates_uniqueness_of :email, :openid, allow_blank: true
  validates :password, length: { within: 6..20  }, allow_blank: true

  after_create :set_slug
  after_create :set_auth_token

  def avatar
    photo = photos.where(photo_type: 'avatar').first
    if photo
      photo.file.url
    else
      DEFAULT_PHOTO
    end
  end

  def age
    return unless date_of_birth
    now = Time.now.utc.to_date
    now.year - date_of_birth.year - ((now.month > date_of_birth.month || (now.month == date_of_birth.month && now.day >= date_of_birth.day)) ? 0 : 1)
  end

  def created_at_formatted
    created_at.strftime("%Y-%m-%d %H:%M:%S")
  end

  def date_of_birth_formatted
    date_of_birth.strftime("%Y-%m-%d %H:%M:%S") if date_of_birth
  end

  def set_slug
    chars = "abcdefghijklmnopqrstuvwxyz1234567890"
    hashids = Hashids.new(ENV["SLUG_SALT"], 8, chars)
    self.slug = hashids.encode(id)
    self.save
  end

  def set_auth_token
    # 创建一个新的auth token
    exp = Time.now.to_i + 3600 * 24 * 365 * 100
    self.authentication_token = JsonWebToken.encode({ user_id: id, exp: exp })
    self.save
  end

  def email_required?
    false
  end

  def password_required?
    false
  end
end
