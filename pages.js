const puppeteer = require('puppeteer')

function run (pagesToScrape) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!pagesToScrape) {
        pagesToScrape = 1;
      }
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://www.tmdn.org/tmview/#/tmview/results?page=1&pageSize=30&criteria=W&offices=AL,AT,BA,BG,BX,CH,CY,CZ,DE,DK,EE,ES,FI,FR,GB,GR,HR,HU,IE,IS,IT,LI,LT,LV,MC,MD,ME,MK,MT,NO,PL,PT,RO,RS,RU,SE,SI,SK,SM,US,EM,WO&territories=AT,BE,BG,HR,CY,CZ,DK,EE,FI,FR,DE,GR,HU,IE,IT,LV,LT,LU,MT,NL,PL,PT,RO,SK,SI,ES,SE,GB,AX,AL,AD,BY,BQ,BA,CW,FO,GI,GG,IS,IM,JE,LI,MD,MC,ME,MK,NO,RU,SH,SM,RS,SX,SJ,CH,UA,VA,US&basicSearch=ace&niceClass=9,OR,35,OR,41,OR,42')
      await page.waitFor(50000);
      let currentPage = 1;
      let urls = [];
      while (currentPage <= pagesToScrape) {
        let newUrls = await page.evaluate(() => {
          let results = [];
          let items = document.querySelectorAll('.sc-lnmtFM');
          items.forEach((item) => {
            results.push({
              text: item.innerText,
            });
          });
          return results
        });
        urls = urls.concat(newUrls);
        if (currentPage < pagesToScrape) {
          await Promise.all([
            await page.click('a.sc-lhVmIH.TfOQd.sc-kvZOFW.bHpWxE'),
            await page.waitFor(50000),
            await page.waitForSelector('.sc-lnmtFM')
            ])
        }
        currentPage++;
      }
      browser.close();
      return resolve(urls);
    } catch (e) {
      return reject(e);
    }
  })
}
run(5).then(console.log).catch(console.error);
