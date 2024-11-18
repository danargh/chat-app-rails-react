class MessagesController < ApplicationController
  def index
    @messages = Message.all.order(created_at: :asc)
    render json: @messages
  end
end
