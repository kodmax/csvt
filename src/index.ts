import { encodeRawValue } from './raw-values/encode-raw-value'
import { RowParser } from './row-parser/row-parser'
import { readStream } from './stream-reader/stream-reader'
import { HeadersDefinition, ParserSettings, RecordDefinition, RecordValues, SheetCell, SheetDefinition } from './types'

export class Sheet<T extends RecordValues> {
    private readonly settings: ParserSettings
    private readonly parser: RowParser<T>
    private readonly cells: RecordDefinition<T>

    public constructor(sheetDefinition: SheetDefinition<T>) {
        this.settings = {
            allowNewLines: false,
            delimiter: ',',
            hasHeaders: false,

            ...sheetDefinition.settings
        }

        this.cells = sheetDefinition.cells
        this.parser = new RowParser<T>(this.settings, this.cells)
    }

    private validateHeaders(headers: string | void): void {
        if (headers) {
            const definition = Object.fromEntries(
                Object.keys(this.cells).map(name => ([name, {
                    index: this.cells[name].index
                }]))
            ) as RecordDefinition<HeadersDefinition<T>>

            const parser = new RowParser<HeadersDefinition<T>>(this.settings, definition)
            const record = parser.parse(headers)

            for (const name of Object.keys(this.cells)) {
                if (record[name] !== this.cells[name].header) {
                    throw new Error('Headers mismatch, expected: ' + this.cells[name].header + ', found: ' + record[name])
                }
            }

        } else {
            throw new Error('Missing headers')
        }
    }

    public parseRows(rows: string[]): T[] {
        if (this.settings.hasHeaders) {
            const headers = rows.shift()
            this.validateHeaders(headers)
        }

        return rows.map(row => this.parser.parse(row))
    }

    public writeRow(record: T): string {
        return this.parser
            .writeCells([], record)
            .map(value => value ?? '')
            .join(this.settings.delimiter)
    }

    public writeHeaders(): string {
        const headers: string[] = []
        for (const name of Object.keys(this.cells)) {
            headers[this.cells[name].index] = this.cells[name].header ?? ''
        }

        return headers.map(title => encodeRawValue(this.settings, title)).join(this.settings.delimiter)
    }

    public async *parseStream(input: NodeJS.ReadableStream): AsyncGenerator<T, void, void> {
        const rows = readStream(input, this.settings)

        if (this.settings.hasHeaders) {
            const firstRow = await rows.next()
            const headers = firstRow.value
            this.validateHeaders(headers)
        }

        for await (const row of rows) {
            yield this.parser.parse(row)
        }
    }
}
