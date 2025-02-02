import {readDataCell} from "./read_data"
import {DataTable} from "./datatable"
import {cellType, inputCellType} from "./interfaces"
/**
 * Rows API
 */
export class Rows {
    cursor: (false | number)

    dt: DataTable

    constructor(dt: DataTable) {
        this.dt = dt

        this.cursor = false
    }

    setCursor(index: (false | number) = false) {
        if (index === this.cursor) {
            return
        }
        const oldCursor = this.cursor
        this.cursor = index
        this.dt._renderTable()
        if (index !== false && this.dt.options.scrollY) {
            const cursorDOM = this.dt.dom.querySelector(`tr.${this.dt.options.classes.cursor}`)
            if (cursorDOM) {
                cursorDOM.scrollIntoView({block: "nearest"})
            }
        }
        this.dt.emit("datatable.cursormove", this.cursor, oldCursor)
    }

    /**
     * Add new row
     */
    add(data: cellType[]) {
        const row = this.dt.options.dataConvert ?
            data.map((cell: cellType, index: number) => {
                const columnSettings = this.dt.columns.settings.columns[index] || {}
                return readDataCell(cell, columnSettings)
            }) :
            data
        this.dt.data.data.push(row)

        // We may have added data to an empty table
        if ( this.dt.data.data.length ) {
            this.dt.hasRows = true
        }
        this.dt.update(true)
    }

    /**
     * Remove row(s)
     */
    remove(select: number | number[]) {
        if (Array.isArray(select)) {
            this.dt.data.data = this.dt.data.data.filter((_row: cellType[], index: number) => !select.includes(index))
            // We may have emptied the table
            if ( !this.dt.data.data.length ) {
                this.dt.hasRows = false
            }
            this.dt.update(true)
        } else {
            return this.remove([select])
        }
    }


    /**
     * Find index of row by searching for a value in a column
     */
    findRowIndex(columnIndex: number, value: string | boolean | number) {
        // returns row index of first case-insensitive string match
        // inside the td innerText at specific column index
        return this.dt.data.data.findIndex(
            (row: cellType[]) => (row[columnIndex].text ?? String(row[columnIndex].data)).toLowerCase().includes(String(value).toLowerCase())
        )
    }

    /**
     * Find index, row, and column data by searching for a value in a column
     */
    findRow(columnIndex: number, value: string | boolean | number) {
        // get the row index
        const index = this.findRowIndex(columnIndex, value)
        // exit if not found
        if (index < 0) {
            return {
                index: -1,
                row: null,
                cols: []
            }
        }
        // get the row from data
        const row = this.dt.data.data[index]
        // return innerHTML of each td
        const cols = row.map((cell: cellType) => cell.data)
        // return everything
        return {
            index,
            row,
            cols
        }
    }

    /**
     * Update a row with new data
     */
    updateRow(select: number, data: inputCellType[]) {
        const row = this.dt.options.dataConvert ?
            data.map((cell: inputCellType, index: number) => {
                const columnSettings = this.dt.columns.settings.columns[index] || {}
                return readDataCell(cell, columnSettings)
            }) :
            data as cellType[]
        this.dt.data.data.splice(select, 1, row)
        this.dt.update(true)
    }
}
