import { encodeRawValue } from './encode-raw-value'

describe('encodeRawValue', () => {
    it('simple', () => {
        expect(encodeRawValue({ delimiter: ',', allowNewLines: false }, '123')).toEqual('123')
    })

    it('quoted', () => {
        expect(encodeRawValue({ delimiter: ',', allowNewLines: false }, '"123"')).toEqual('"""123"""')
    })

    it('with comma', () => {
        expect(encodeRawValue({ delimiter: ',', allowNewLines: false }, '12,3')).toEqual('"12,3"')
    })

    it('with untrimmed spaces', () => {
        expect(encodeRawValue({ delimiter: ',', allowNewLines: false }, '  123  ')).toEqual('"  123  "')
    })

    it('with new lines allowed', () => {
        expect(encodeRawValue({ delimiter: ',', allowNewLines: true }, '123\n\n456\n')).toEqual('"123\n\n456\n"')
    })

    describe('no multiline', () => {
        it('includes new lines', () => {
            expect(encodeRawValue({ delimiter: ',', allowNewLines: false }, '123\n456')).toEqual('123 456')
        })

        it('starts with or ends with new lines', () => {
            expect(encodeRawValue({ delimiter: ',', allowNewLines: false }, '\n\n123 456\n\n')).toEqual('123 456')
        })

        it('mix of new lines', () => {
            expect(encodeRawValue({ delimiter: ',', allowNewLines: false }, '\n\n123\n\n456\n\n')).toEqual('123 456')
        })
    })

})
