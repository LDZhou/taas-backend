class CreatePhotos < ActiveRecord::Migration[5.1]
  def change
    create_table :photos do |t|
      t.integer :target_id
      t.string :target_type
      t.string :name
      t.string :file
      t.string :photo_type

      t.timestamps
    end
  end
end
