class CreateApplications < ActiveRecord::Migration[5.1]
  def change
    create_table :applications do |t|
      t.string :name
      t.string :api_key

      t.timestamps
    end
  end
end
