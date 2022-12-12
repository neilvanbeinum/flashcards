require "test_helper"
require "minitest/mock"

class PromptBuilderTest < ActiveSupport::TestCase
  test "it returns keywords from the text above a threshold score" do
    builder = ImageGeneration::PromptBuilder.new

    mock_rake = Minitest::Mock.new
    mock_rake.expect(:analyse, { "mouse" => 1.0, "house" => 1.0, "the" => 0.4 }, ["mouse in the house", RakeText.SMART])

    RakeText.stub :new, mock_rake do
      assert_equal "mouse house", builder.extract_keywords("mouse in the house")
    end

    mock_rake.verify
  end
end
