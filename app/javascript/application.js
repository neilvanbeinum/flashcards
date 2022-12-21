import "@hotwired/turbo-rails"
import { setupTest } from "test"
import "controllers"

document.addEventListener("turbo:load", () => {
  const testContainer = document.querySelector("#test-container")

  if (testContainer) {
    setupTest()
  }
})
