module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      # self.current_user = find_verified_user
      logger.info "WebSocket connected: #{request.origin} | #{current_user}"
    end

    # private
    #   def find_verified_user
    #   end
  end
end
