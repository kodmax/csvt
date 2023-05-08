import { Sheet } from '.'
import { Readable } from 'stream'

describe('csvt', () => {
    describe('headers', () => {
        const sheet = new Sheet<[date: string, title: string, address: string, ammount: number]>({
            settings: { allowNewLines: true, hasHeaders: true },
            headers: ['ad', 'td', 'tt', 'ad', 'an', 'am', 'ba', 'id'],
            records: [
                { index: 1, read: v => v },
                { index: 2, read: v => v },
                { index: 3, read: v => v },
                { index: 5, read: v => Math.round(+v.replace(',', '.') * 100) }
            ]
        })

        it('validate headers', () => {
            const records = sheet.parseRows([
                'ad, td, tt, ad, an, am, ba, id',
                '06-05-2023,05-05-2023,Zakup BLIK PayPro SA Pastelowa 860-198 Poznan ref:1234,PayPro SA Pastelowa 860-198 Poznan,72 1234 1234 0000 0000 4800 1234,"-332,42","1038,63",1,'
            ])

            expect(records).toEqual([
                ['05-05-2023', 'Zakup BLIK PayPro SA Pastelowa 860-198 Poznan ref:1234', 'PayPro SA Pastelowa 860-198 Poznan', -33242]
            ])
        })
    })

    describe('sheet', () => {
        const sheet = new Sheet<[date: string, title: string, address: string, ammount: number]>({
            settings: { allowNewLines: true },
            records: [
                { index: 1, read: v => v },
                { index: 2, read: v => v },
                { index: 3, read: v => v },
                { index: 5, read: v => Math.round(+v.replace(',', '.') * 100) }
            ]
        })

        it('read from string', () => {
            const records = sheet.parseRows([
                '06-05-2023,05-05-2023,Zakup BLIK PayPro SA Pastelowa 860-198 Poznan ref:1234,PayPro SA Pastelowa 860-198 Poznan,72 1234 1234 0000 0000 4800 1234,"-332,42","1038,63",1,'
            ])

            expect(records).toEqual([
                ['05-05-2023', 'Zakup BLIK PayPro SA Pastelowa 860-198 Poznan ref:1234', 'PayPro SA Pastelowa 860-198 Poznan', -33242]
            ])
        })

        it('read from stream', async () => {
            const stream = Readable.from([
                '06-05-2023,05-05-2023,"Zakup ',
                'BLIK PayPro SA Pastelowa 8\n60-198 Poznan ref: 1234", Pa',
                'yPro SA Pastelowa 8\t60-198 Poznan, 72 1234 1234 0000 0000 4800 1234, "-332,42",',
                '"1038,63", 1, \n',
                '06-05-2023,05-05-2023,"Zakup ',
                'BLIK PayPro SA Pastelowa 8\n60-198 Poznan ref: 1234", Pa',
                'yPro SA Pastelowa 8\t60-198 Poznan, 72 1234 1234 0000 0000 4800 1234, "-1332,42",',
                '"11038,63", 1, \n',
                '06-05-2023,05-05-2023,"Zakup ',
                'BLIK PayPro SA Pastelowa 8\n60-198 Poznan ref: 1234", Pa',
                'yPro SA Pastelowa 8\t60-198 Poznan, 72 1234 1234 0000 0000 4800 1234, "-2332,42",',
                '"21038,63", 1, \n'
            ], { encoding: 'utf-8' })

            const records = []
            for await (const record of sheet.parseStream(stream)) {
                records.push(record)
            }

            expect(records).toEqual([
                ['05-05-2023', 'Zakup BLIK PayPro SA Pastelowa 8\n60-198 Poznan ref: 1234', 'PayPro SA Pastelowa 8\t60-198 Poznan', -33242],
                ['05-05-2023', 'Zakup BLIK PayPro SA Pastelowa 8\n60-198 Poznan ref: 1234', 'PayPro SA Pastelowa 8\t60-198 Poznan', -133242],
                ['05-05-2023', 'Zakup BLIK PayPro SA Pastelowa 8\n60-198 Poznan ref: 1234', 'PayPro SA Pastelowa 8\t60-198 Poznan', -233242]
            ])
        })
    })

})
