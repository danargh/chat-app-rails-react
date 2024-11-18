class ChatChannel < ApplicationCable::Channel
  def subscribed
    logger.info "Subscribed to ChatChannel"
    stream_from "chat_channel"
  end

  def unsubscribed
    logger.info "Unsubscribed from ChatChannel"
  end

  def speak(data)
    Message.create!(username: data["username"], content: data["content"])
    ActionCable.server.broadcast("chat_channel", data)
  end
end
