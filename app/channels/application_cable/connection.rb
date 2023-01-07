# frozen_string_literal: true

module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_account

    def connect
      self.current_account = find_current_account
    end

    private

    def find_current_account
      account_id = session['account_id']

      Account.find_by(id: account_id) || reject_unauthorized_connection
    end

    def session
      cookies.encrypted['_flashcards_session'] || {}
    end
  end
end
