class AddAppIdToChains < ActiveRecord::Migration[5.1]
  def change
    add_column :chains, :app_id, :integer
  end
end
