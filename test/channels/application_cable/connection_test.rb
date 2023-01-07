# frozen_string_literal: true

require 'test_helper'

module ApplicationCable
  class ConnectionTest < ActionCable::Connection::TestCase
    test 'connects with cookies' do
      account = accounts(:one)

      cookies.encrypted[:_flashcards_session] = { 'account_id' => account.id }

      connect

      assert_equal account, connection.current_account
    end

    test 'rejects connection without cookies' do
      assert_reject_connection { connect }
    end
  end
end
