export class Card {
  static cards = []

  static all() {
    return this.cards
  }

  static updateAll(newCards) {
    this.cards = newCards
  }

  constructor({ frontText, backText }) {
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
    this.createdAt = Date.now()
  }

  save() {
    Card.cards = [...Card.cards, { ...this, createdAt: new Date() }]
  }
}
