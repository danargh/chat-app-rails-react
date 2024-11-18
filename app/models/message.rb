class Message < ApplicationRecord
  validates :username, :content, presence: true
end
