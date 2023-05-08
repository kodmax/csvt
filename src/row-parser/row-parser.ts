import { encodeRawValue } from '../raw-values/encode-raw-value'
import { getRawValues } from '../raw-values/get-raw-values'
import { ParserSettings, RecordValues, RecordDefinition } from '../types'

type Settings = Omit<ParserSettings, 'hasHeaders'>

export class RowParser<T extends RecordValues>{
    public constructor(private readonly settings: Settings, private readonly definition: RecordDefinition<T>) {

    }

    public parse(row: string): T {
        const values = getRawValues(this.settings.delimiter, row)
        const record: T = Object.fromEntries(
            Object.keys(this.definition).map(name => {
                const cell = this.definition[name]
                const value = values[cell.index]
                return [name, cell.read
                    ? cell.read(value)
                    : value
                ]
            })
        ) as T

        return record
    }

    public writeCells(values: string[], record: T): string[] {
        for (const name of Object.keys(this.definition)) {
            const cell = this.definition[name]
            values[cell.index] = encodeRawValue(this.settings, cell.write
                ? cell.write(record[name])
                : String(record[name])
            )
        }

        return values
    }
}
