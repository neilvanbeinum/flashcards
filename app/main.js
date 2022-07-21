import { STORAGE_KEY } from '../../app/constants.js'

let cards = JSON.parse(window.localStorage[STORAGE_KEY] || '[]')

let testCards = []
let testInProgress = false
let currentTestCard

const cardsDOMList = document.querySelector('#cards')
const startTestButton = document.querySelector('button#start-test')
const createCardFieldSet = document.querySelector('fieldset#create-card-fieldset')
const flipCardButton = document.querySelector('button#flip-card')
const nextCardButton = document.querySelector('button#next-card')
const testContainer = document.querySelector('div#test-container')

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

const toggleStartButtonEnabled = (isOn) => startTestButton.disabled = !isOn

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

  toggleStartButtonEnabled(cards.length > 0)
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

const displayCardText = (text) => {
  testContainer.innerHTML = `<p>${text}</p>`
}

const shiftAndDisplayNextCard = () => {
  currentTestCard = new CardTestPresenter(testCards.shift())
  displayCardText(currentTestCard.nextFaceText())

  if(testCards.length === 0) {
    nextCardButton.disabled = true
  }
}

const toggleCardListDisabled = (isDisabled) => {
  document.querySelectorAll('.delete-card').forEach(
    button => button.disabled = isDisabled
  )
}

const toggleTestStart = () => {
  if(!testInProgress) {
    testInProgress = true

    createCardFieldSet.disabled = true
    startTestButton.innerText = 'End Test'
    flipCardButton.disabled = false
    nextCardButton.disabled = false
    toggleCardListDisabled(true)
    
    testCards = structuredClone(cards)

    shiftAndDisplayNextCard()
  } else {
    testInProgress = false

    createCardFieldSet.disabled = false
    startTestButton.innerText = 'Start Test'
    flipCardButton.disabled = true
    nextCardButton.disabled = true
    toggleCardListDisabled(false)

    testContainer.innerHTML = ''
  }
}

const flipCurrentTestCard = () => {
  displayCardText(currentTestCard.nextFaceText())
}

class CardTestPresenter {
  constructor(card) {
    this.card = card
    this.frontIsCurrentFace = true
  }

  nextFaceText() {
    const text = this.frontIsCurrentFace ? this.card.frontText : this.card.backText

    this.frontIsCurrentFace = !this.frontIsCurrentFace

    return text
  }
}

document.querySelector('#save-btn').addEventListener('click', createCard)

startTestButton.addEventListener('click', toggleTestStart)
flipCardButton.addEventListener('click', flipCurrentTestCard)
nextCardButton.addEventListener('click', shiftAndDisplayNextCard)

displayCards()
