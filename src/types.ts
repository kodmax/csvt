export type SheetHeader<T> = {
    cb?: (v: string) => T
    name: string
}

export type SheetHeaders<T extends any[]> = {
    [I in keyof T]: SheetHeader<T[I]>
}

export type SheetCell<T> = {
    write?: (v: T) => string
    read?: (v: string) => T
    index: number
}

export type SheetRecord<T extends any[]> = {
    [I in keyof T]: SheetCell<T[I]>
}

export type ParserSettings = {
    hasHeaders: boolean
    allowNewLines: boolean
    delimiter: string
}

export type SheetDefinition<T extends any[]> = {
    settings?: Partial<ParserSettings>
    records: SheetRecord<T>
    headers?: string[]
}

