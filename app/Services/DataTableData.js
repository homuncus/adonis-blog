module.exports = class DataTableData {
    constructor(draw, collection, error = null) {
        this.draw = parseInt(draw)
        this.recordsTotal = collection.pages.total
        this.recordsFiltered = collection.rows.length
        this.data = collection.toJSON().data
        this.error = error
    }
}