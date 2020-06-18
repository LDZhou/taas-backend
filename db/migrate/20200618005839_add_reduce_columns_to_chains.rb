class AddReduceColumnsToChains < ActiveRecord::Migration[5.1]
  def change
    add_column :chains, :reduce_volume, :integer
    add_column :chains, :reduce_power, :integer
    add_column :chains, :reduce_co2, :integer
  end
end
