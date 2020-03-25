class AddNameToChains < ActiveRecord::Migration[5.1]
  def change
    add_column :chains, :name, :string
  end
end
