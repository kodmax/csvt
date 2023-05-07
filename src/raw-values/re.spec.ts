import { re } from './re'

describe('re', () => {
    it('unquoted', () => {
        expect('123'.match(re)).toBe(null)
    })

    it('quoted', () => {
        const match = '"123"'.match(re)
        expect(match ? match[0] : void 0).toBe('"123"')
        expect(match ? match[1] : void 0).toBe('123')
    })

    it('quoted and including double quotes', () => {
        const match = '"""123"""'.match(re)
        expect(match ? match[0] : void 0).toBe('"""123"""')
        expect(match ? match[1] : void 0).toBe('""123""')
    })

    it('quoted with spaces', () => {
        const match = '" 123 "'.match(re)
        expect(match ? match[0] : void 0).toBe('" 123 "')
        expect(match ? match[1] : void 0).toBe(' 123 ')
    })

    it('quoted and whitespace outside', () => {
        const match = ' " 123 " '.match(re)
        expect(match ? match[0] : void 0).toBe(' " 123 " ')
        expect(match ? match[1] : void 0).toBe(' 123 ')
    })
})
