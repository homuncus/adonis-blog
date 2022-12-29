const DataTableData = use('App/Services/DataTableData')

module.exports = class DataTable {
  constructor(query, searchFields, data) {
    if (!searchFields.length) {
      throw new Error('At least one search field is required')
    }
    const {
      search, order, columns
    } = data

    query.whereRaw(`LOWER(${searchFields[0]}) LIKE LOWER('%${search.value}%')`)
    searchFields.slice(1).forEach((field) => {
      query.orWhereRaw(`LOWER(${field}) LIKE LOWER('%${search.value}%')`)
    })
    query.orderBy(`${columns[order[0].column].data}`, `${order[0].dir}`)

    this.query = query
    this.data = data
  }

  async result() {
    const {
      draw, start, length,
    } = this.data
    const collection = await this
      .query
      .paginate(start / length + 1, length)
    return new DataTableData(
      draw,
      collection
    )
  }
}
