import puppeteer from "puppeteer";

const EXTENSION_PATH = '..';

let browser;
let worker;

/*beforeEach(async () => {
  // TODO: Launch the browser.
  browser = await puppeteer.launch({
    headless: false,
    pipe: true,
    enableExtensions: [EXTENSION_PATH]
  });
  
  const workerTarget = await browser.waitForTarget( 
    (target) => target.type === 'service_worker' && target.url().endsWith('service-worker.js')
  )

  worker = await workerTarget.worker();
});

afterEach(async () => {
  // TODO: Close the browser.
  await browser.close();
  browser = undefined;
});

test("displays a bookmark", async() => {

    const page = await browser.newPage();
    
    await worker.evaluate('chrome.action.openPop();');

    const popupTarget = await browser.waitForTarget(
        (target) => target.type() === 'page' && target.url().endsWith('popup.html')
    );

    const popup = await popupTarget.asPage();
    const list = await page.$('ul');
    const children = await page.$('li');

    expect(children.length).toBe(1);
});

test("toggles reading time checkbox", async() => {


});

test("deletes work by clicking on icon", async() => {
    const page = await browser.newPage();

    const popupTarget = await browser.waitForTarget(
        (target) => target.type() === 'page' && target.url().endsWith('popup.html')
    );

    
    //const deleteBtn = document.getElementByClass('delete-work');
    //deleteBtn.click();

    //test that a certain line no longer exists now that the delete button has been clicked
    
});*/

/*
  - end-to-end test or popup
    - display of bookmark list
    - appearance of work
    - deletion of work
    - direction to URL upon clicking
    - toggle on reading time checkbox
  - test for badge?
    - display number of bookmarks
    - increase number of bookmarks
    - decrease number of bookmarks
*/