import "@hotwired/turbo-rails"
import { setupTest } from "test"
import { setupStepOne, setupStepTwo } from "createCard"

document.addEventListener("turbo:load", () => {
  const cardForm = document.querySelector("#new-card-form")

  if (cardForm) {
    setupStepOne(cardForm)
  }

  const cardNew2Form = document.querySelector("#new-2-card-form")

  if (cardNew2Form) {
    setupStepTwo(cardNew2Form)
  }

  const testContainer = document.querySelector("#test-container")

  if (testContainer) {
    setupTest()
  }
})
