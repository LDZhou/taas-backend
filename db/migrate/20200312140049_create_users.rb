class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.string :nickname
      t.integer :gender
      t.string :city
      t.string :slug
      t.boolean :admin

      t.timestamps
    end
    add_index :users, :slug
  end
end
