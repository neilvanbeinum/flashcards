# frozen_string_literal: true

require 'rake_text'

module ImageGeneration
  class PromptBuilder
    THRESHOLD = 0.5

    def build(text)
      "#{extract_keywords(text)} #{MODIFICATION_KEYWORDS.sample}"
    end

    private

    def extract_keywords(text)
      RakeText.new.analyse(text, RakeText.SMART).filter_map do |word, score|
        word if score > THRESHOLD
      end.join(' ')
    end
  end
end
