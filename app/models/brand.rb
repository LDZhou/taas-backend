class Brand < ApplicationRecord
  has_many :products, -> { order 'created_at DESC'  }
end
