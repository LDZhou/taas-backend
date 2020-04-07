# encoding: utf-8

class PhotoUploader < CarrierWave::Uploader::Base

  # Include RMagick or MiniMagick support:
  # include CarrierWave::RMagick
  include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader:
  #storage ENV['STORAGE'].to_sym
  storage :tencent_cos

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   # For Rails 3.1+ asset pipeline compatibility:
  #   # ActionController::Base.helpers.asset_path("fallback/" + [version_name, "default.png"].compact.join('_'))
  #
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  #process :eager => true
  #process :use_filename => true
  #process :tags => ['user_photo']
  #process resize_to_fit: [1200, 1200]

  # def scale(width, height)
  #   # do something
  # end

  # Create different versions of your uploaded files:
  version :thumb, :if => :image? do
    process :resize_to_fill => [240, 240]
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_white_list
    %w(pdf jpg jpeg gif png mp4 avi flv mov wmv)
  end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  def public_id
    dir + secure_token
  end

  def filename
    secure_token + File.extname(super) if super
  end

  def dir
    "#{Rails.env}/#{model.target_type}/photos/"
  end

  protected

  def image?(new_file)
    new_file.content_type.start_with?('image') if new_file && new_file.respond_to?(:content_type)
  end

  def secure_token
    var = :"@#{mounted_as}_secure_token"
    model.instance_variable_get(var) or model.instance_variable_set(var, SecureRandom.uuid)
  end
end
