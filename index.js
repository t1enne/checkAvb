const readline = require('readline');
const cheerio = require('cheerio');
const app = require('express');
const fetch = require('node-fetch');
let colors = require('colors');

(async function main() {
  try {
    let data = {
      options: {
        "credentials": "include",
        "headers": {
          "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:79.0) Gecko/20100101 Firefox/79.0",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded",
          "Upgrade-Insecure-Requests": "1",
        },
        "referrer": "https://websmart.brunellocucinelli.it/bcweb/login.pgm?msg_info=&errore=",
        "body": "task=controllo&url_richiesto=&utente=ntaov&password=ntaov345",
        "method": "POST",
        "mode": "cors"
      }
    }
    let headers = {
      "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Upgrade-Insecure-Requests": "1",
      "Cookie": await getCookie()
    }

    const url = 'https://websmart.brunellocucinelli.it/bcweb/LOGIN.pgm'


    async function getCookie() {

      console.log('Logging In')

      let loginPage = await fetch("https://websmart.brunellocucinelli.it/bcweb/LOGIN.pgm", {
        "credentials": "include",
        "headers": {
          "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:79.0) Gecko/20100101 Firefox/79.0",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded",
          "Upgrade-Insecure-Requests": "1",
        },
        "referrer": "https://websmart.brunellocucinelli.it/bcweb/login.pgm?msg_info=&errore=",
        "body": "task=controllo&url_richiesto=&utente=ntaov&password=ntaov345",
        "method": "POST",
        "mode": "cors"
      });
      let cookie = loginPage.headers.raw()['set-cookie'][0].split(';')[0]
      return cookie

    }

    async function availabilityRequest(model, color) {

      console.log(`Fetching sku ${model} : ${color}`)

      let html = await fetch("https://websmart.brunellocucinelli.it/bcweb/WRTICMO10R.pgm", {
        "credentials": "include",
        "headers": headers,
        "referrer": "https://websmart.brunellocucinelli.it/bcweb/wrticmo10r.pgm",
        "body": `task=filter&ww_fseriale=&ww_fdataMatrix=&br_barcode=&ww_fLAK=&ww_fBCRMODELL=${model}&ww_fBCRCOLORE=${color}&ww_flinea=`,
        "method": "POST",
        "mode": "cors"
      }).then(res => res.text())

      // LOGGIN OUT RESULTS

      let $ = cheerio.load(html)
      const rows = $('#listtable tbody tr')
        .slice(2);
      try {
        for (let i = 0; i < rows.length; i++) {
          let $element = $(rows[i]);
          // console.log($element.text());

          let sku = {}
          let tds = Object.values($element.find($('td')));

          sku.year = $(tds[0]).text().split(' ')[1].trim().slice(-2)
          sku.season = $(tds[0]).text().search('A/I') === 0 ? '2' : '1'
          sku.model = $(tds[2]).find('a').text().split('+')[1].trim()
          sku.color = tds[3].children[0]['data']
          sku.descr = $(tds[4]).text()
          sku.picUrl = `https://websmart.brunellocucinelli.it/nsd/BC/modelli/${sku.year}${sku.season}/${sku.model}_1.jpg`;

          async function anagraficaModello() {
            let html = await fetch("https://websmart.brunellocucinelli.it/bcweb/WWEBORD07R.pgm", {
              "credentials": "include",
              "headers": headers,
              "referrer": "https://websmart.brunellocucinelli.it/bcweb/WWEBORD07R.pgm",
              "body": `task=filter&ww_fBGMIDSTG=${sku.year}${sku.season}&ww_fBGACODICE=${model}&ww_fBGADESCR1=&ww_fBGBLINEAV=&ww_fBTCCWOGR1=&ww_fBHDDSCLST=&ww_fStato=T&ww_fFotoUsa=T`,
              "method": "POST",
              "mode": "cors"
            }).then(res => res.text())

            let $ = cheerio.load(html)
            let buttonUrl = $('.actions > a').attr('href')
            await fetch(`https://websmart.brunellocucinelli.it/bcweb/${buttonUrl}`, {
                "credentials": "include",
                "headers": headers,
                "referrer": "https://websmart.brunellocucinelli.it/bcweb/WWEBORD07R.pgm",
                "method": "GET",
                "mode": "cors"
              }).then(res => res.text())
              .then(priceHtml => {
                let $ = cheerio.load(priceHtml);
                let price = $('tr.altcol2:nth-child(7) > td:nth-child(2)').text()
                console.log(price.blue);
              })
          }
          console.log('\n' + `${sku.year}${sku.season} ${sku.model} ${sku.color} (${sku.descr})`.green + '\n');
          await anagraficaModello()


          // CHECK AVAILABLE SIZES

          for (let y = 0; y < tds.length; y++) {

            let td = tds[y]
            if ($(td).attr('onclick') != undefined) {
              let reqSize = $(td).attr('onclick').split(',')[4].slice(1, 3)

              let fetchUrl = `https:/` + `/websmart.brunellocucinelli.it/bcweb/WRTICMO10R.pgm?TASK=dett&BCRSTGANN=${sku.year}&BCRSTGSIG=${sku.season}&BCRMODELL=${sku.model}&BCRCOLORE=${sku.color}&idx_taglia=${reqSize}`;

              await fetch(fetchUrl, {
                  "credentials": "include",
                  "headers": headers,
                  "referrer": "https://websmart.brunellocucinelli.it/bcweb/WRTICMO10R.pgm",
                  "method": "GET",
                  "mode": "cors"
                })
                .then(res => res.text())
                .then(html => {
                  let $r = cheerio.load(html)
                  let size = $r('table.mainlist:nth-child(1) > thead:nth-child(1) > tr:nth-child(4) > th:nth-child(2)').text().trim()

                  console.log('\n' + size.yellow)

                  let shops = $r('table.mainlist:nth-child(2) > tbody:nth-child(2) > tr > td:nth-child(2)')
                  for (let i = 0; i < shops.length; i++) {
                    console.log($r(shops[i]).text());
                  }
                })
            };
          }
        }
      } catch (e) {
        console.log(e);
      }
    }

    async function getTable() {

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })

      rl.question('SKU: ', (answer) => {
        let model = answer.split(' ')[0]
        let color = answer.split(' ')[1] || '';

        availabilityRequest(model, color)
        rl.close()
      })
    }



    getTable()
  } catch (e) {
    console.log(e);
  }

})();