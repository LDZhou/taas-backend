class UserView < ApplicationRecord
  belongs_to :user
  belongs_to :target, polymorphic: true, optional: true

  def created_at_formatted
    created_at.strftime("%Y-%m-%d %H:%M:%S")
  end
end
