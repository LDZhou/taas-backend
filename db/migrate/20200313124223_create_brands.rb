class CreateBrands < ActiveRecord::Migration[5.1]
  def change
    create_table :brands do |t|
      t.integer :brand_type
      t.string :name
      t.string :address
      t.string :contact_name
      t.string :contact_title
      t.string :contact_phone
      t.string :contact_email

      t.timestamps
    end
  end
end
