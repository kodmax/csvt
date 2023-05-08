import { Sheet } from '.'
import { Readable } from 'stream'

describe('csvt', () => {
    describe('headers', () => {
        const sheet = new Sheet<{ date: string; title: string; recipient: string; amount: number }>({
            settings: { allowNewLines: true, hasHeaders: true },
            headers: ['ad', 'td', 'tt', 'ad', 'an', 'am', 'ba', 'id'],
            cells: {
                date: { index: 1 },
                title: { index: 2 },
                recipient: { index: 3 },
                amount: { index: 5, read: v => Math.round(+v.replace(',', '.') * 100) }
            }
        })

        it('validate headers', () => {
            const records = sheet.parseRows([
                'ad, td, tt, ad, an, am, ba, id',
                '06-05-2023,05-05-2023,Zakup BLIK PayPro SA Pastelowa 860-198 Poznan ref:1234,PayPro SA Pastelowa 860-198 Poznan,72 1234 1234 0000 0000 4800 1234,"-332,42","1038,63",1,'
            ])

            expect(records).toEqual([
                {
                    date: '05-05-2023',
                    title: 'Zakup BLIK PayPro SA Pastelowa 860-198 Poznan ref:1234',
                    recipient: 'PayPro SA Pastelowa 860-198 Poznan',
                    amount: -33242
                }
            ])
        })
    })

    describe('write', () => {
        const sheet = new Sheet<{ date: string; title: string; recipient: string; amount: number }>({
            settings: { allowNewLines: false },
            headers: ['Date', 'Title', 'Recipient', 'Amount'],
            cells: {
                date: { index: 0 },
                title: { index: 1 },
                recipient: { index: 2 },
                amount: { index: 3, write: v => (v / 100).toFixed(2).replace('.', ',') }
            }
        })

        it('write row', () => {
            const row = sheet.writeRow({
                date: '05-05-2023',
                title: 'Zakup BLIK PayPro SA Pastelowa 8\n60-198 Poznan\nref: 1234',
                recipient: 'PayPro SA Pastelowa 8 60-198 Poznan',
                amount: -33242
            })

            expect(row).toEqual(
                '05-05-2023,Zakup BLIK PayPro SA Pastelowa 8 60-198 Poznan ref: 1234,PayPro SA Pastelowa 8 60-198 Poznan,"-332,42"'
            )
        })

        it('write headers', () => {
            const row = sheet.writeRow({
                date: '05-05-2023',
                title: 'Zakup BLIK PayPro SA Pastelowa 8\n60-198 Poznan\nref: 1234',
                recipient: 'PayPro SA Pastelowa 8 60-198 Poznan',
                amount: -33242
            })

            expect(sheet.writeHeaders()).toEqual(
                'Date,Title,Recipient,Amount'
            )
        })
    })

    describe('sheet', () => {
        const sheet = new Sheet<{ date: string; title: string; recipient: string; amount: number }>({
            settings: { allowNewLines: true },
            cells: {
                date: { index: 1 },
                title: { index: 2 },
                recipient: { index: 3 },
                amount: { index: 5, read: v => Math.round(+v.replace(',', '.') * 100) }
            }
        })

        it('read from string', () => {
            const records = sheet.parseRows([
                '06-05-2023,05-05-2023,Zakup BLIK PayPro SA Pastelowa 860-198 Poznan ref:1234,PayPro SA Pastelowa 860-198 Poznan,72 1234 1234 0000 0000 4800 1234,"-332,42","1038,63",1,'
            ])

            expect(records).toEqual([
                {
                    date: '05-05-2023',
                    title: 'Zakup BLIK PayPro SA Pastelowa 860-198 Poznan ref:1234',
                    recipient: 'PayPro SA Pastelowa 860-198 Poznan',
                    amount: -33242
                }
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
                {
                    date: '05-05-2023',
                    title: 'Zakup BLIK PayPro SA Pastelowa 8\n60-198 Poznan ref: 1234',
                    recipient: 'PayPro SA Pastelowa 8\t60-198 Poznan',
                    amount: -33242
                },
                {
                    date: '05-05-2023',
                    title: 'Zakup BLIK PayPro SA Pastelowa 8\n60-198 Poznan ref: 1234',
                    recipient: 'PayPro SA Pastelowa 8\t60-198 Poznan',
                    amount: -133242
                },
                {
                    date: '05-05-2023',
                    title: 'Zakup BLIK PayPro SA Pastelowa 8\n60-198 Poznan ref: 1234',
                    recipient: 'PayPro SA Pastelowa 8\t60-198 Poznan',
                    amount: -233242
                }
            ])
        })
    })

})
