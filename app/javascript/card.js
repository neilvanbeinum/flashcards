export class Card {
  constructor({
    front_text: frontText,
    back_text: backText,
    created_at: createdAt = Date.now(),
    signpost_url: signpostUrl,
  } = {}) {
    frontText = frontText?.trim()
    backText = backText?.trim()

    const cardObj = { frontText, backText }

    Object.entries(cardObj).forEach(([textKey, textValue]) => {
      if (!textValue) {
        throw `${textKey} - value required but was blank`
      }
    })

    this.frontText = frontText
    this.backText = backText
    this.createdAt = createdAt
    this.signpostUrl = signpostUrl
  }
}

export class CardTestPresenter {
  constructor(card) {
    this.card = card
    this.frontIsCurrentFace = true
  }

  flip(displayElement) {
    this.frontIsCurrentFace = !this.frontIsCurrentFace

    this.displayCurrentFace(displayElement)
  }

  displayCurrentFace(displayElement) {
    const elements = this.frontIsCurrentFace
      ? this.frontHTML()
      : this.backHTML()

    displayElement.innerHTML = null

    elements.forEach((elem) => displayElement.appendChild(elem))
  }

  frontHTML() {
    const p = document.createElement("p")
    p.innerText = this.card.frontText

    return [p]
  }

  backHTML() {
    const p = document.createElement("p")
    p.innerText = this.card.backText

    if (this.hasImage()) {
      const image = document.createElement("img")
      image.setAttribute("src", this.imageUrl())

      return [image, p]
    } else {
      return [document.createElement("div"), p]
    }
  }

  hasImage() {
    return !!this.card.signpostUrl
  }

  imageUrl() {
    return this.card.signpostUrl
  }
}
