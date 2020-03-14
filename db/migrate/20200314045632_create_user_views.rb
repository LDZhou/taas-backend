class CreateUserViews < ActiveRecord::Migration[5.1]
  def change
    create_table :user_views do |t|
      t.integer :user_id
      t.integer :target_id
      t.string :target_type

      t.timestamps
    end
    add_index :user_views, :user_id
    add_index :user_views, [:target_type, :target_id]
  end
end
