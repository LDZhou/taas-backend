class CreateChainProducts < ActiveRecord::Migration[5.1]
  def change
    create_table :chain_products do |t|
      t.integer :chain_id
      t.integer :product_id
      t.integer :index, default: 1

      t.timestamps
    end
    add_index :chain_products, :chain_id
    add_index :chain_products, :product_id
  end
end
