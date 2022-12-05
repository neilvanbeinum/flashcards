export default class Card {
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
