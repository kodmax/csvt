import { ParserSettings } from '../types'

type Settings = Omit<ParserSettings, 'hasHeaders' | 'delimiter'>

export async function* readStream(input: NodeJS.ReadableStream, { allowNewLines }: Settings): AsyncGenerator<string, void, void> {
    const content: string[] = []
    let inQuotes = false
    let wasQuote = false

    for await (const data of input) {
        let chunk = String(data)

        for (let i = 0; i < chunk.length; i++) {
            switch (chunk[i]) {
                case '"':
                    if (inQuotes) {
                        wasQuote = !wasQuote

                    } else {
                        if (!wasQuote) {
                            inQuotes = true
                            wasQuote = false

                        } else {
                            wasQuote = true
                        }
                    }
                    break

                case '\n': case '\r':
                    if (!inQuotes || !allowNewLines) {
                        content.push(chunk.substring(0, i))
                        const line = content.splice(0, content.length).join('').trim()
                        if (line.length > 0) {
                            yield line
                        }

                        chunk = chunk.substring(i + 1)
                        wasQuote = false
                        inQuotes = false
                        i = 0
                    }
                    break

                default:
                    if (inQuotes && wasQuote) {
                        inQuotes = false
                    }

                    wasQuote = false
            }
        }

        if (chunk.length > 0) {
            content.push(chunk)
        }
    }

    if (content.length > 0) {
        const line = content.join('')
        if (line.length > 0) {
            yield line
        }

    }
}
