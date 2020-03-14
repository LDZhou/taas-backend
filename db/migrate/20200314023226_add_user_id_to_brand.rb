class AddUserIdToBrand < ActiveRecord::Migration[5.1]
  def change
    add_column :brands, :user_id, :integer
  end
end
