import { RowParser } from './row-parser'

describe('row parser', () => {
    it('parse', () => {
        const parser = new RowParser<[date: string, title: string, address: string, ammount: number]>({ delimiter: ',', allowNewLines: false }, [
            { index: 1, read: v => new Date(v).toISOString().substring(0, 10) },
            { index: 2 },
            { index: 3 },
            { index: 5, read: v => Math.round(+v.replace(',', '.') * 100) }
        ])

        const [date, title, address, ammount] = parser.parse(
            '06-05-2023,05-05-2023,Zakup BLIK PayPro SA Pastelowa 860-198 Poznan ref:1234,PayPro SA Pastelowa 860-198 Poznan,72 1234 1234 0000 0000 4800 1234,"-332,42","1038,63",1,'
        )

        expect(date).toBe('2023-05-04')
        expect(title).toBe('Zakup BLIK PayPro SA Pastelowa 860-198 Poznan ref:1234')
        expect(address).toBe('PayPro SA Pastelowa 860-198 Poznan')
        expect(ammount).toBe(-33242)
    })

    it('write', () => {
        const parser = new RowParser<[date: string, title: string, address: string, ammount: number]>({ delimiter: ',', allowNewLines: false }, [
            { index: 1 },
            { index: 2 },
            { index: 3 },
            { index: 5, write: v => (v/100).toFixed(2).replace('.', ',') }
        ])

        const row = parser.write([
            '05-05-2023',
            'Zakup BLIK PayPro SA Pastelowa 8\n60-198 Poznan\nref: 1234',
            'PayPro SA Pastelowa 8 60-198 Poznan',
            -33242
        ])

        expect(row).toBe(
            ',05-05-2023,Zakup BLIK PayPro SA Pastelowa 8 60-198 Poznan ref: 1234,PayPro SA Pastelowa 8 60-198 Poznan,,"-332,42"'
        )
    })
})
