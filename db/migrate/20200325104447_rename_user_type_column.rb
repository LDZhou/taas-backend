class RenameUserTypeColumn < ActiveRecord::Migration[5.1]
  def change
    remove_column :users, :user_type
    add_column :users, :user_type, :integer, default: 0
  end
end
