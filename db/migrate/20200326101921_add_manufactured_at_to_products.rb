class AddManufacturedAtToProducts < ActiveRecord::Migration[5.1]
  def change
    add_column :products, :manufactured_at, :datetime
  end
end
