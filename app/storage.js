const STORAGE_KEY = "cards"

export default class CardStorage {
  static records = []

  static getRecords() {
    this.records = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || JSON.stringify([])
    )

    return this.records
  }

  static deleteRecord(record) {
    const recordToDelete = this.records.find(
      (r) => r.createdAt === record.createdAt
    )

    const recordIndex = this.records.indexOf(recordToDelete)

    if (recordIndex < 0) {
      throw "Cannot delete a record which does not exist"
    }

    this.records = [
      ...this.records.slice(0, recordIndex),
      ...this.records.slice(recordIndex + 1),
    ]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records))
  }

  static createRecord(record) {
    this.records = [...this.records, record]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records))
  }
}
