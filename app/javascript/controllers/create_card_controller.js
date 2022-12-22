import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["stepOne", "stepTwo", "backLink"]

  submitStep1(e) {
    const stepElements = Array.from(
      this.stepOneTarget.querySelectorAll("input, textarea, select")
    )

    if (stepElements.every((e) => e.reportValidity())) {
      this.stepOneTarget.classList.remove("active")
      this.stepTwoTarget.classList.add("active")

      this.backLinkTarget.classList.add("active")
    }
  }

  previousStep(e) {
    e.preventDefault()

    this.stepTwoTarget.classList.remove("active")
    this.stepOneTarget.classList.add("active")

    this.backLinkTarget.classList.remove("active")
  }
}
