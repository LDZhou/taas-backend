class AddCityProvinceToBrands < ActiveRecord::Migration[5.1]
  def change
    add_column :brands, :city, :string
    add_column :brands, :province, :string
  end
end
