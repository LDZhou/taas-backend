class AddAppIdToBrands < ActiveRecord::Migration[5.1]
  def change
    add_column :brands, :app_id, :integer
  end
end
