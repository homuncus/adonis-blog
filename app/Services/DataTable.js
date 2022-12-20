const DataTableData = use('App/Services/DataTableData')

module.exports = class DataTable extends DataTableData {
    constructor(draw, collection) {
        super(
            parseInt(draw), 
            collection.pages.total, 
            collection.rows.length,
            collection.toJSON().data
        )
    }
}
