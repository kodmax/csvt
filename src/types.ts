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
    header?: string
    index: number
}

export type RecordValues = Record<string, any>
export type RecordDefinition<R extends RecordValues> = {
    [N in keyof R]: SheetCell<R[N]>
}


export type ParserSettings = {
    hasHeaders: boolean
    allowNewLines: boolean
    delimiter: string
}

export type SheetDefinition<T extends RecordValues> = {
    settings?: Partial<ParserSettings>
    cells: RecordDefinition<T>
    headers?: string[]
}

