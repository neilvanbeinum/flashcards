import { STORAGE_KEY } from "./constants.js"

let records = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")

const storage = {
  getRecords: () => {
    return records
  },

  updateRecords(updatedRecords) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords))
  },
}

export default storage
