require "rake_text"

module ImageGeneration
  class PromptBuilder
    THRESHOLD = 0.5

    def build(text)
      "#{ extract_keywords(text) } #{ MODIFICATION_KEYWORDS.sample }"
    end

    private

    def extract_keywords(text)
      RakeText.new.analyse(text, RakeText.SMART).filter_map do |word, score|
        word if score > THRESHOLD
      end.join(" ")
    end
  end

  MODIFICATION_KEYWORDS = [
    "cartoon line drawing",
    "van gogh",
    "dali",
    "watercolour",
    "black and white",
    "ink",
    "pencil",
    "checkered",
    "close-up",
    "crazy",
    "googly eyes",
    "surprised",
    "upside down",
    "dancing",
    "vermeer",
    "in a museum",
    "in space",
    "cave painting",
    "on a t shirt",
    "punk",
    "tie dye",
    "sunny",
    "dusk",
    "campfire",
    "circled",
    "inverted colours",
    "swirl effect"
  ].freeze
end
