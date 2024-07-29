const {normalizeURL, getURLFromHtml} = require('./crawl.js')
const {test, expect} = require('@jest/globals')

test('normalizeURL function test', () => {
    const input = 'https://coba/pat/'
    const actual = normalizeURL(input)
    const expected = 'coba/pat'
    expect(actual).toEqual(expected)
})

test('getURL function test', () => {
    const inputHtmlBody = `
    <html>
        <head></head>
        <body>
            <a href = 'invalid'></a>
        </body>
    </html>`
    const inputBaseURL = 'https://coba'
    const actual = getURLFromHtml(inputHtmlBody, inputBaseURL)
    const expected = []
    expect(actual).toEqual(expected)
})