class AddLatLngToUserView < ActiveRecord::Migration[5.1]
  def change
    add_column :user_views, :latitude, :float
    add_column :user_views, :longitude, :float
    add_column :user_views, :address, :string
    add_column :user_views, :city, :string
    add_column :user_views, :province, :string
    add_column :user_views, :district, :string
    add_column :user_views, :street, :string
    add_column :user_views, :street_no, :string
  end
end
