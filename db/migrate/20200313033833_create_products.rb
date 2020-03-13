class CreateProducts < ActiveRecord::Migration[5.1]
  def change
    create_table :products do |t|
      t.integer :brand_id
      t.float :wastage_percent
      t.float :additive_percent
      t.string :name
      t.string :model
      t.string :size
      t.float :weight
      t.integer :quantity
      t.string :material
      t.string :material_percent
      t.datetime :send_date
      t.datetime :deliver_date
      t.string :pkg_name
      t.integer :pkg_quantity
      t.string :sender_name
      t.string :sender_address
      t.string :receiver_name
      t.string :receiver_address
      t.string :shipping_company
      t.string :shipping_no

      t.timestamps
    end
    add_index :products, :brand_id
  end
end
