const cheerio = require('cheerio');
const fetch = require('node-fetch');
// const fs = require('fs');
// const fileType = require('file-type');

let data = {}

async function getCookie() {
  let cookie = await fetch("https://websmart.brunellocucinelli.it/bcweb/LOGIN.pgm", {
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
  }).then(res => res.headers.raw()['set-cookie'][0].split(';')[0])
  // let cookie = loginPage.headers.raw()['set-cookie'][0].split(';')[0];
  return cookie;
}

async function getPrice(headers, year, season, model) {
  console.log(`getting price for ${model}`);
  let html = await fetch("https://websmart.brunellocucinelli.it/bcweb/WWEBORD07R.pgm", {
    "credentials": "include",
    "headers": headers,
    "referrer": "https://websmart.brunellocucinelli.it/bcweb/WWEBORD07R.pgm",
    "body": `task=filter&ww_fBGMIDSTG=${year}${season}&ww_fBGACODICE=${model}&ww_fBGADESCR1=&ww_fBGBLINEAV=&ww_fBTCCWOGR1=&ww_fBHDDSCLST=&ww_fStato=T&ww_fFotoUsa=T`,
    "method": "POST",
    "mode": "cors"
  }).then(res => res.text())

  let $ = cheerio.load(html)
  let buttonUrl = $('.actions > a').attr('href')
  let price = await fetch(`https://websmart.brunellocucinelli.it/bcweb/${buttonUrl}`, {
      "credentials": "include",
      "headers": headers,
      "referrer": "https://websmart.brunellocucinelli.it/bcweb/WWEBORD07R.pgm",
      "method": "GET",
      "mode": "cors"
    }).then(res => res.text())
    .then(priceHtml => {
      let $ = cheerio.load(priceHtml);
      let p = $('tr.altcol2:nth-child(7) > td:nth-child(2)').text()
      console.log(p);
      return p
    })
  return price
}

async function getImage(headers, year, season, model) {
  console.log(`fetching image ${model}`);
  let start = Date.now()
  let buffer = await fetch(`https://websmart.brunellocucinelli.it/nsd/BC/modelli/${year}${season}/${model}_1.jpg`, {
      "credentials": "include",
      "headers": headers,
      "referrer": "https://websmart.brunellocucinelli.it/bcweb/WRTICMO10R.pgm",
      "method": "GET",
      "mode": "cors"
    })
    .then(res => res.buffer())

  if (buffer == undefined) {
    buffer = await fetch(`https://websmart.brunellocucinelli.it/nsd/BC/modelli/${year}${season}/${model}_10.jpg`, {
        "credentials": "include",
        "headers": headers,
        "referrer": "https://websmart.brunellocucinelli.it/bcweb/WRTICMO10R.pgm",
        "method": "GET",
        "mode": "cors"
      })
      .then(res => res.buffer())
  }

  let end = Date.now()
  console.log((end - start) / 1000);


  let b64 = Buffer.from(buffer).toString('base64')
  return `data:image/jpeg;base64,${b64}`

  // .then(res => {
  //    const dest = fs.createWriteStream('./public/picture.jpg');
  //    res.body.pipe(dest);
  // })
}


async function availabilityRequest(model, color, onlyImage) {
  console.log(onlyImage);
  data.results = {};
  let cookie = await getCookie();

  let headers = {
    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Upgrade-Insecure-Requests": "1",
    "Cookie": cookie
  }

  console.log(`Fetching sku ${model} : ${color}`)

  try {
    let html = await fetch("https://websmart.brunellocucinelli.it/bcweb/WRTICMO10R.pgm", {
      "credentials": "include",
      "headers": headers,
      "referrer": "https://websmart.brunellocucinelli.it/bcweb/wrticmo10r.pgm",
      "body": `task=filter&ww_fseriale=&ww_fdataMatrix=&br_barcode=&ww_fLAK=&ww_fBCRMODELL=${model}&ww_fBCRCOLORE=${color}&ww_flinea=`,
      "method": "POST",
      "mode": "cors"
    }).then(res => res.text())

    //CHECK IF LOGIN SUCCEEDED
    if (html === `<html><head></head><body NOSPLASH onload="location.replace('/bcweb/login.pgm?task=logout&errore=nonvalid');"></body></html>`) {
      console.log(`LOGIN FAILED!!`);
    }
    // LOGGIN OUT RESULTS
    let $ = cheerio.load(html)
    const rows = $('#listtable tbody tr')
      .slice(2);

    for (let i = 0; i < rows.length; i++) {
      let $element = $(rows[i]);
      //console.log($element.text());

      let sku = {}
      let tds = Object.values($element.find($('td')));

      sku.year = $(tds[0]).text().split(' ')[1].trim().slice(-2)
      sku.season = $(tds[0]).text().search('A/I') === 0 ? '2' : '1'
      sku.model = $(tds[2]).find('a').text().split('+')[1].trim()
      sku.color = tds[3].children[0]['data']
      sku.descr = $(tds[4]).text();

      let price = getPrice(headers, sku.year, sku.season, model)
      sku.price = await price;
      sku.sizes = {};
      sku.shops = [];
      sku.string = `${sku.year}${sku.season} ${sku.model} ${sku.color}`;

      // IF ONLYIMAGE IS TRUE GET THE PICTURE
      if (i == 0 && onlyImage == true) {
        let pic = getImage(headers, sku.year, sku.season, sku.model)
        sku.picture = await pic;
      }

      // CHECK AVAILABLE SIZES

      for (let y = 0; y < tds.length; y++) {
        let td = tds[y]
        if ($(td).attr('onclick') != undefined) {
          let reqSize = $(td).attr('onclick').split(',')[4].slice(1, 3)

          let fetchUrl = `https:/` + `/websmart.brunellocucinelli.it/bcweb/WRTICMO10R.pgm?TASK=dett&BCRSTGANN=${sku.year}&BCRSTGSIG=${sku.season}&BCRMODELL=${sku.model}&BCRCOLORE=${sku.color}&idx_taglia=${reqSize}`;

          let html = await fetch(fetchUrl, {
              "credentials": "include",
              "headers": headers,
              "referrer": "https://websmart.brunellocucinelli.it/bcweb/WRTICMO10R.pgm",
              "method": "GET",
              "mode": "cors"
            })
            .then(res => res.text())
          let $r = cheerio.load(html)
          let size = $r('table.mainlist:nth-child(1) > thead:nth-child(1) > tr:nth-child(4) > th:nth-child(2)').text().trim();
          console.log(size);

          let shops = $r('table.mainlist:nth-child(2) > tbody:nth-child(2) > tr > td:nth-child(2)')

          for (let z = 0; z < shops.length; z++) {
            sku.shops.push($r(shops[z]).text())
          }
          sku.sizes[size] = sku.shops
          sku.shops = []

          // PUSH THE RESULTS FOR THIS SKU INTO RESULTS
          if (size) {
            data.results[`${i}`] = sku;
            console.log('pushed ' + i);
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}

async function getAvb(model, color, onlyImage) {
  try {
    await availabilityRequest(model, color, onlyImage);
    console.log(data.results);
    return data.results
  } catch (e) {
    console.log(e.message);
  }
}

async function getToReceive() {
  try {

    let cookie = await getCookie;
    let headers = {
      "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Upgrade-Insecure-Requests": "1",
      "Cookie": cookie
    }

    await fetch("https://websmart.brunellocucinelli.it/bcweb/WRTIRIO02R.pgm", {
      "credentials": "include",
      "headers": headers,
      "referrer": "https://websmart.brunellocucinelli.it/bcweb/WRTIRIO02R.pgm",
      "body": `task=filter&ww_fStagione=${sku.year}${sku.season}&ww_fBAPMODELL=${sku.model}&ww_fBAPCOLORE=&ww_fBAMORDTPL=CO&ww_fBAMORDTPL=C1&ww_fBAMORDTPL=C2&ww_fBAMORDTPL=C2N&ww_fBAMORDTPL=DR&ww_fBAMORDTPL=DS&ww_fBAMORDTPL=E&ww_fBAMORDTPL=EBA&ww_fBAMORDTPL=EBG&ww_fBAMORDTPL=EBI&ww_fBAMORDTPL=EBN&ww_fBAMORDTPL=EBP&ww_fBAMORDTPL=EBR&ww_fBAMORDTPL=EDG&ww_fBAMORDTPL=ENA&ww_fBAMORDTPL=ERA&ww_fBAMORDTPL=ETA&ww_fBAMORDTPL=EVG&ww_fBAMORDTPL=EVP&ww_fBAMORDTPL=EXG&ww_fBAMORDTPL=EXN&ww_fBAMORDTPL=G&ww_fBAMORDTPL=GB&ww_fBAMORDTPL=GRC&ww_fBAMORDTPL=GS&ww_fBAMORDTPL=L1&ww_fBAMORDTPL=L2&ww_fBAMORDTPL=N&ww_fBAMORDTPL=NB&ww_fBAMORDTPL=ND&ww_fBAMORDTPL=OTT&ww_fBAMORDTPL=P&ww_fBAMORDTPL=PIR&ww_fBAMORDTPL=PIS&ww_fBAMORDTPL=PM&ww_fBAMORDTPL=PS&ww_fBAMORDTPL=RCB&ww_fBAMORDTPL=RCN&ww_fBAMORDTPL=RCP&ww_fBAMORDTPL=RCR&ww_fBAMORDTPL=RCT&ww_fBAMORDTPL=RPR&ww_fBAMORDTPL=T&ww_fBAMORDTPL=TF&ww_fBAMORDTPL=TF1&ww_fBAMORDTPL=TN&ww_fBAMORDTPL=TNF&ww_fBAMORDTPL=T1&ww_fBAMORDTPL=U&ww_fBAMORDTPL=US&ww_fBAMORDTPL=USS&ww_fBAMORDTPL=YBC&ww_fBAMORDTPL=YRC&ww_fBAMORDTPL=YRP&ww_fBAMORDTPL=YRS&ww_fBAMORDTPL3=GP1&ww_fBAMORDTPL3=GR&ww_fBAMORDTPL3=GRT&ww_fBAMORDTPL3=GR1&ww_fBAMORDTPL3=GR2&ww_fBAMORDTPL3=GR3&ww_fBAMORDTPL3=GT1&ww_fBAMORDTPL3=GUT&ww_fBAMORDTPL3=GU1&ww_fBAMORDTPL3=G10&ww_fBAMORDTPL3=G11&ww_fBAMORDTPL3=NR&ww_fBAMORDTPL3=NR1&ww_fBAMORDTPL3=PGR&ww_fBAMORDTPL5=T&ww_fBAMORDTPL5=TF&ww_fBAMORDTPL5=TF1&ww_fBAMORDTPL5=TN&ww_fBAMORDTPL5=TNF&ww_fBAMORDTPL5=T1&ww_fBAMORDTPL6=GP1&ww_fBAMORDTPL6=GRT&ww_fBAMORDTPL6=GT1&ww_fBAMORDTPL6=PGR&ww_fBAMORDTPL2=BS1&ww_fBAMORDTPL2=RB&ww_fBAMORDTPL2=R1&ww_fBAMORDTPL2=R1Q&ww_fBAMORDTPL2=R13&ww_fBAMORDTPL2=R2&ww_fBAMORDTPL2=R2Q&ww_fBAMORDTPL2=R3&ww_fBAMORDTPL2=R4&ww_fBAMORDTPL2=R5&ww_fBAMORDTPL2=R50&ww_fBAMORDTPL2=R51&ww_fBAMORDTPL2=R6&ww_fBAMORDTPL2=R7&ww_fBAMORDTPL2=R8&ww_fBAMORDTPL2=R9&ww_fBAMORDTPL4=Z&ww_fBAMORDTPL4=ZD&ww_fStagione2=&ww_fTessuto=&ww_fBAMCLIENT=&ww_fGCDSC1=&clienti=1006000&ww_fINCLUDI=I&ww_fBTFPTIPOL=DOS&ww_fBTFPTIPOL=FRANCH_MONO&ww_fBTFPTIPOL=FRANCH_MULTI&tipo_buoni=BUONI&ww_fBCRUBICAZ=DISPOAI&ww_fBCRUBICAZ=DISPOPE&ww_fBCRUBICAZ=DISPOSM&ww_fBCRUBICAZ=LSDISPO&ww_fBCRUBICAZ=LSTYLE&ww_fBCRUBICAZ=MAGIONE&ww_fBCRUBICAZ=NEG1&ww_fBCRUBICAZ=NEG2&ww_fBCRUBICAZ=STK16-1&ww_fBCRUBICAZ=STK16-2&ww_fBCRUBICAZ=XDISPO&flgTipFil=S&flgModello=S%3E&flgColore=S`,
      "method": "POST",
      "mode": "cors"
    });
  } catch (e) {
    console.log(e);
  }
}
module.exports = getAvb;