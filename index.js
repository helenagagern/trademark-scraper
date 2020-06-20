const puppeteer = require('puppeteer')

void (async () => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://drive.google.com/file/d/0B3HebLpkReCeYV9DRWtEQVF1SWM/view')
    await page.waitFor(50000);
    await page.screenshot({
      path: './screenshots/page1.png'
    })
    await page.pdf({ path: './pdfs/page1.pdf'})

    const trademarks = await page.evaluate(() => {
      let results = [];
      let items = document.querySelectorAll('.sc-lnmtFM')
      items.forEach((item) => {
        results.push({
          text: item.innerText,
        });
      });
      return results;
    })
    console.log(JSON.stringify(trademarks, null, 2))

    await browser.close()

  } catch (error) {
    console.log(error)
  }
})()




