import { getRawValues } from '../raw-values/get-raw-values'
import { ParserSettings, SheetRecord } from '../types'

type Settings = Omit<ParserSettings, 'hasHeaders' | 'allowNewLines' | 'trim'>

export class RowParser<T extends any[]>{
    private readonly delimiter: string

    public constructor({ delimiter }: Settings, private readonly definition: SheetRecord<T>) {
        this.delimiter = delimiter
    }

    public parse(row: string): T {
        const values = getRawValues(this.delimiter, row)

        return this.definition.map(cell =>
            cell.cb(values[cell.index])
        ) as T
    }
}
