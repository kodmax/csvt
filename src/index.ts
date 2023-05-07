import { RowParser } from './row-parser/row-parser'
import { readStream } from './stream-reader/stream-reader'
import { ParserSettings, SheetCell, SheetDefinition } from './types'

export class Sheet<T extends any[]> {
    private readonly settings: ParserSettings
    private readonly headers?: string[]
    private readonly parser: RowParser<T>

    public constructor(sheetDefinition: SheetDefinition<T>) {
        this.settings = {
            allowNewLines: false,
            delimiter: ',',
            hasHeaders: false,
            
            ...sheetDefinition.settings
        }

        this.parser = new RowParser<T>(this.settings, sheetDefinition.records)
        this.headers = sheetDefinition.headers
    }

    private validateHeaders(headers: string | void): void {
        if (headers) {
            if (this.headers) {
                const definition: SheetCell<string>[] = this.headers.map((name, i) => ({
                    index: i, cb: v => v
                }))
    
                const parser = new RowParser<string[]>(this.settings, definition)
                const record = parser.parse(headers)
                for (let i = 0; i < this.headers.length; i++) {
                    if (record[i] !== this.headers[i]) {
                        throw new Error('Headers mismatch: ' + record [i])
                    }
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