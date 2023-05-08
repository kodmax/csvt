import { RowParser } from './row-parser'

describe('row parser', () => {
    const parser = new RowParser<{ date: string; title: string; recipient: string; amount: number }>({ delimiter: ',', allowNewLines: false }, {
        date: { index: 1, read: v => new Date(v).toISOString().substring(0, 10) },
        title: { index: 2 },
        recipient: { index: 3 },
        amount: {
            write: v => (v / 100).toFixed(2).replace('.', ','),
            read: v => Math.round(+v.replace(',', '.') * 100),
            index: 5
        }
    })

    it('parse', () => {
        const {date, title, recipient, amount} = parser.parse(
            '06-05-2023,05-05-2023,Zakup BLIK PayPro SA Pastelowa 860-198 Poznan ref:1234,PayPro SA Pastelowa 860-198 Poznan,72 1234 1234 0000 0000 4800 1234,"-332,42","1038,63",1,'
        )

        expect(date).toBe('2023-05-04')
        expect(title).toBe('Zakup BLIK PayPro SA Pastelowa 860-198 Poznan ref:1234')
        expect(recipient).toBe('PayPro SA Pastelowa 860-198 Poznan')
        expect(amount).toBe(-33242)
    })

    it('write', () => {

        const row = parser.writeCells([], {
            date: '05-05-2023',
            title: 'Zakup BLIK PayPro SA Pastelowa 8\n60-198 Poznan\nref: 1234',
            recipient: 'PayPro SA Pastelowa 8 60-198 Poznan',
            amount: -33242
        })

        expect(row).toEqual([
            void 0,
            '05-05-2023',
            'Zakup BLIK PayPro SA Pastelowa 8 60-198 Poznan ref: 1234',
            'PayPro SA Pastelowa 8 60-198 Poznan',
            void 0,
            '"-332,42"'
        ])
    })
})
