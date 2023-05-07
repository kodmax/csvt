import { Readable } from 'stream'
import { readStream } from './stream-reader'

describe('stream reader', () => {
    it('read stream', async () => {
        const stream = Readable.from([
            '06-05-2023,05-05-2023,"Zakup ',
            'BLIK ""PayPro SA"" Pastelowa 8\n60-198 Poznan\nref: 1234", Pa',
            'yPro SA Pastelowa 8\t60 - 198 Poznan, 72 1234 1234 0000 0000 4800 1234, "-332,42",',
            '"1038,63", 1, ',
            '\n\r',
            '\n\n1, 2, 3\n4, 5, 6'
        ], { encoding: 'utf-8' })

        const rows = []
        for await (const row of readStream(stream, { allowNewLines: true })) {
            rows.push(row)
        }

        expect(rows).toEqual([
            '06-05-2023,05-05-2023,"Zakup BLIK ""PayPro SA"" Pastelowa 8\n60-198 Poznan\nref: 1234", PayPro SA Pastelowa 8\t60 - 198 Poznan, 72 1234 1234 0000 0000 4800 1234, "-332,42","1038,63", 1,',
            '1, 2, 3',
            '4, 5, 6'
        ])
    })
})
