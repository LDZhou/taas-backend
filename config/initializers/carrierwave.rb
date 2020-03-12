CarrierWave.configure do |conf|
  conf.storage        = :tencent_cos  # set as default storage
  conf.cache_storage = :file
  conf.tencent_cos    = {
    secret_id:      ENV['TENCENT_SECRET_ID'],
    secret_key:     ENV['TENCENT_SECRET_KEY'],
    host:           ENV['TENCENT_COS_URL'],
    parent_path:    "/#{Rails.env}"
  }
end
