import consumer from "channels/consumer"

const cards = document.querySelector("#cards")

if (cards) {
  consumer.subscriptions.create(
    { channel: "DecksChannel", id: cards.getAttribute("data-deck-id") },
    {
      received(data) {
        const cardId = data["card_id"]
        const newStatusName = data["status"]

        const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)

        const imageStatus = cardElement.querySelector(".image-status")

        imageStatus.innerText = `Image ${newStatusName}`

        cardElement.className = `card ${newStatusName}`
      },
    }
  )
}
