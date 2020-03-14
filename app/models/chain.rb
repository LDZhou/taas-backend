class Chain < ApplicationRecord
  has_many :chain_products, -> { order('index ASC') }
end
