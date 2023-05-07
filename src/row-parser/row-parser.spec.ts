import { RowParser } from './row-parser'

describe('csvt', () => {
    describe('load csv', () => {
        it('should load', () => {
            const parser = new RowParser<[date: string, title: string, address: string, ammount: number]>({ delimiter: ',' }, [
                { index: 1, cb: v => new Date(v).toISOString().substring(0, 10) },
                { index: 2, cb: v => v },
                { index: 3, cb: v => v },
                { index: 5, cb: v => Math.round(+v.replace(',', '.') * 100) }
            ])

            const [date, title, address, ammount] = parser.parse(
                '06-05-2023,05-05-2023,Zakup BLIK PayPro SA Pastelowa 860-198 Poznan ref:1234,PayPro SA Pastelowa 860-198 Poznan,72 1234 1234 0000 0000 4800 1234,"-332,42","1038,63",1,'
            )

            expect(date).toBe('2023-05-04')
            expect(title).toBe('Zakup BLIK PayPro SA Pastelowa 860-198 Poznan ref:1234')
            expect(address).toBe('PayPro SA Pastelowa 860-198 Poznan')
            expect(ammount).toBe(-33242)
        })
    })
})
