let cardToCreate = {}

export const setupStepOne = (cardForm) => {
  document.querySelector("#front_text").value = cardToCreate.frontText || ""

  cardForm.addEventListener("turbo:submit-start", (e) => {
    e.detail.formSubmission.stop()

    const form = document.querySelector("form")
    const data = new FormData(form)

    cardToCreate = {
      ...cardToCreate,
      frontText: data.get("front_text"),
    }

    Turbo.visit("/deck/cards/new_two")
  })
}

export const setupStepTwo = (cardForm) => {
  document.querySelector("#card_front_text").value = cardToCreate.frontText

  cardForm.addEventListener("turbo:submit-end", (e) => {
    if (e.detail.success) {
      cardToCreate = {}
    }
  })
}
