const puppeteer = require('puppeteer')

function run (pagesToScrape) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!pagesToScrape) {
        pagesToScrape = 1;
      }
      const browser = await puppeteer.launch({headless: false});
      const page = await browser.newPage();
      await page.goto('https://www.tmdn.org/tmview/#/tmview/results?page=1&pageSize=30&criteria=W&offices=AL,AT,BA,BG,BX,CH,CY,CZ,DE,DK,EE,ES,FI,FR,GB,GR,HR,HU,IE,IS,IT,LI,LT,LV,MC,MD,ME,MK,MT,NO,PL,PT,RO,RS,RU,SE,SI,SK,SM,US,EM,WO&territories=AT,BE,BG,HR,CY,CZ,DK,EE,FI,FR,DE,GR,HU,IE,IT,LV,LT,LU,MT,NL,PL,PT,RO,SK,SI,ES,SE,GB,AX,AL,AD,BY,BQ,BA,CW,FO,GI,GG,IS,IM,JE,LI,MD,MC,ME,MK,NO,RU,SH,SM,RS,SX,SJ,CH,UA,VA,US&basicSearch=ace&niceClass=9,OR,35,OR,41,OR,42')
      await page.waitForSelector('button.sc-hycgNl.inAWdR.sc-ekkqgF.dkdxYu.sc-jTzLTM.iNBqCm', {timeout: 0});
      console.log("Looking for button")
      await page.click('button.sc-hycgNl.dLngva.sc-ekkqgF.dkdxYu.sc-jTzLTM.kObAAP')
      console.log("clicked")
      await page.waitForSelector('.sc-htpNat.hbnyto', {timeout: 0})
      console.log("Clicked button")
      let currentPage = 1;
      let urls = [];
      while (currentPage <= pagesToScrape) {
        let newUrls = await page.evaluate(() => {
          let results = [];
          console.log("Selecting description")
          let items = document.querySelectorAll('.sc-dEfkYy.fEMFCz.sc-gqjmRU.dYHjUr');
          items.forEach((item) => {
            if (item.innerText !== "") {
              results.push({
                text: item.innerText,
              });
            }
          });
          return results
        });
        urls = urls.concat(newUrls);
        if (currentPage < pagesToScrape) {
          await Promise.all([
            await page.click('a.sc-lhVmIH.TfOQd.sc-kvZOFW.bHpWxE'),
            await page.waitForSelector('.sc-lnmtFM')

            ])
          console.log("Looking for next page")
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
run(4).then(console.log).catch(console.error);
