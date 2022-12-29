module.exports = class DataTableData {
  constructor(draw, collection, error = null) {
    const json = collection.toJSON()
    this.draw = parseInt(draw, 10)
    this.recordsTotal = json.total
    this.recordsFiltered = json.data.length
    this.data = json.data
    this.error = error
  }
}
