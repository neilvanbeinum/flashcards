import CardStorage from "storage"

export default class Card {
  static all() {
    return CardStorage.getRecords().map((record) => new Card(record))
  }

  constructor({ frontText, backText, createdAt = Date.now() } = {}) {
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
  }

  save() {
    CardStorage.createRecord(this)
  }

  delete() {
    CardStorage.deleteRecord(this)
  }
}
