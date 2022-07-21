import { STORAGE_KEY } from '../../app/constants.js'

let cards = JSON.parse(window.localStorage[STORAGE_KEY] || '[]')

const cardsDOMList = document.querySelector('#cards')

const addCard = (frontText, backText) => {
  frontText = frontText?.trim()
  backText = backText?.trim()
  
  const cardObj = { frontText, backText }
  
  Object.entries(cardObj)
  .forEach(([textKey, textValue]) => {
    if (!textValue) { 
      throw `${textKey} - value required but was blank`
    }
  })
  
  cards.push({
    ...cardObj,
    createdAt: Date.now()
  })
}

const removeCardAt = (index) => {
  return () => {
    cards = [
      ...cards.slice(0, index),
      ...cards.slice(index + 1),
    ]

    saveToLocalStorage()
    displayCards()
  }
}

const saveToLocalStorage = () => {
  window.localStorage[STORAGE_KEY] = JSON.stringify(cards)
}

const displayCards = () => {
  const cardFragments = cards.map((card, index) => {
    const fragment = document.createRange().createContextualFragment(
      `<li>${card.frontText} - ${card.backText}<button class="delete-card">Delete</button></li>`
    )

    fragment.querySelector('button.delete-card').addEventListener('click', removeCardAt(index))

    return fragment
  })
  
  cardsDOMList.innerHTML = ''
  cardsDOMList.append(...cardFragments)
}

const createCard = () => {
  const frontText = document.querySelector('#front-text')
  const backText = document.querySelector('#back-text')

  addCard(frontText.value, backText.value)
  saveToLocalStorage()
  displayCards()

  frontText.value = ''
  backText.value = ''
}

document.querySelector('#save-btn').addEventListener('click', createCard)

displayCards()
