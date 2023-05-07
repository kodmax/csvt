import { re } from './re'

export const getRawValues = (separator: string, row: string): string[] => {
    const values = []

    for (let i = 0; i <= row.length; i++) {
        if (i === row.length) {
            values.push('')

        } else {
            const rest = row.substring(i)

            const quoted = rest.match(re)
            if (quoted) {
                values.push(quoted[1].replace(/""/g, '"'))
                i += quoted[0].length

            } else {
                const nextDelimiter = row.indexOf(separator, i)
                if (nextDelimiter === -1) {
                    values.push(rest.trim())
                    i = row.length

                } else {
                    values.push(row.substring(i, nextDelimiter).trim())
                    i = nextDelimiter
                }
            }
        }
    }

    return values
}
