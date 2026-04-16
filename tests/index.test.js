const puppeteer = require('puppeteer')

let browser;
let worker;

const EXTENSION_PATH = '.'

const SINGLE_CHAPTER_URL = 'https://archiveofourown.org/works/78677781'
const MULTIPLE_CHAPTER_URL = 'https://archiveofourown.org/works/78676756/chapters/206308126'

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false,
        pipe: true,
        enableExtensions: [EXTENSION_PATH],
        args: [`--disable-extensions-except=${EXTENSION_PATH}`,
            `--load-extension=${EXTENSION_PATH}`
        ],
    })
})

afterEach(async () => {
    browser.close()
    browser = undefined
})

test('TESTING URL', async () => {
    const page = await browser.newPage()
    await page.goto(`${SINGLE_CHAPTER_URL}`)

    //addIds()
})