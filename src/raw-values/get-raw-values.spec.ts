import { getRawValues } from './get-raw-values'

describe('getRawValues', () => {
    it('simple', () => {
        expect(getRawValues(',', '1,2,3')).toEqual(
            ['1', '2', '3']
        )
    })

    it('empty', () => {
        expect(getRawValues(',', ',,')).toEqual(
            ['', '', '']
        )
    })

    it('double quotes', () => {
        expect(getRawValues(',', '1,2,3,"4"')).toEqual(
            ['1', '2', '3', '4']
        )
    })

    it('double quotes', () => {
        expect(getRawValues(',', '1,2,3,""')).toEqual(
            ['1', '2', '3', '']
        )
    })

    it('double quotes', () => {
        expect(getRawValues(',', '1,2,3,"""4"""')).toEqual(
            ['1', '2', '3', '"4"']
        )
    })

    it('trim', () => {
        expect(getRawValues(',', '1, 2, 3, " 4 "')).toEqual(
            ['1', '2', '3', ' 4 ']
        )
    })
})
