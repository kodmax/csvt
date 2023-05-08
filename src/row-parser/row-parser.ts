import { encodeRawValue } from '../raw-values/encode-raw-value'
import { getRawValues } from '../raw-values/get-raw-values'
import { ParserSettings, SheetRecord } from '../types'

type Settings = Omit<ParserSettings, 'hasHeaders'>

export class RowParser<T extends any[]>{
    public constructor(private readonly settings: Settings, private readonly definition: SheetRecord<T>) {

    }

    public parse(row: string): T {
        const values = getRawValues(this.settings.delimiter, row)

        return this.definition.map(cell => {
            const value = values[cell.index]
            return cell.read
                ? cell.read(value)
                : value
        }) as T
    }

    public writeCells(values: string[], record: T): string[] {
        this.definition.forEach((cell, i) => {
            values[cell.index] = encodeRawValue(this.settings, cell.write
                ? cell.write(record[i])
                : String(record[i])
            )
        })

        return values
    }
}
