import { ParserSettings } from '../types'

export const enquote = (value: string): string => `"${value.replaceAll('"', '""')}"`
const reQuotesNeeded = /"|^[ \t]|[ \t]$|\r|\n/
const reTrimNewLine = /^[\r\n]+|[\r\n]+$/g
const reSpaceNewLine = /[\r\n]+/g

type Settings = Omit<ParserSettings, 'hasHeaders'>
export const encodeRawValue = (settings: Settings, value: string): string => {
    if (settings.allowNewLines === false) {
        value = value.replaceAll(reTrimNewLine, '').replaceAll(reSpaceNewLine, ' ')
    }

    if (value.indexOf(settings.delimiter) !== -1 || reQuotesNeeded.test(value)) {
        return enquote(value)

    } else {
        return value
    }
}
