class ChangeWeightTypeInProducts < ActiveRecord::Migration[5.1]
  def change
    change_column :products, :weight, :string
  end
end
