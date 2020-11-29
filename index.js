const cheerio = require('cheerio');
const fetch = require('node-fetch');

let data = {
  results: {}
}

async function getCookie(user, pwd) {
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
    "body": `task=controllo&url_richiesto=&utente=${user}&password=${pwd}`,
    "method": "POST",
    "mode": "cors"
  }).then(res => res.headers.raw()['set-cookie'][0].split(';')[0])
  return {
    'cookie': cookie
  };
}

async function getPrice(cookie, year, season, model) {
  try {
    let html = await fetch("https://websmart.brunellocucinelli.it/bcweb/WWEBORD07R.pgm", {
      "credentials": "include",
      "headers": {
        "cookie": cookie
      },
      "referrer": "https://websmart.brunellocucinelli.it/bcweb/WWEBORD07R.pgm",
      "body": `task=filter&ww_fBGMIDSTG=${year}${season}&ww_fBGACODICE=${model}&ww_fBGADESCR1=&ww_fBGBLINEAV=&ww_fBTCCWOGR1=&ww_fBHDDSCLST=&ww_fStato=T&ww_fFotoUsa=T`,
      "method": "POST",
      "mode": "cors"
    }).then(res => res.text())

    let $ = cheerio.load(html)


    let buttonUrl = $('.actions > a').attr('href')
    let price = await fetch(`https://websmart.brunellocucinelli.it/bcweb/${buttonUrl}`, {
        "credentials": "include",
        "headers": {
          "cookie": cookie
        },
        "referrer": "https://websmart.brunellocucinelli.it/bcweb/WWEBORD07R.pgm",
        "method": "GET",
        "mode": "cors"
      })
      .then(res => res.text())
      .then(priceHtml => {
        $ = cheerio.load(priceHtml);
        let p = $('.mainlist:nth-child(1) tr:contains("SOLOMEO") > td:nth-child(2)').text()
        return p
      })
    return price
  } catch (e) {
    console.error(e);
  }
}

async function getImage(cookie, year, season, model) {
  try {
    let headers = {
      "Cookie": cookie
    }

    let buffer = await fetch(`https://websmart.brunellocucinelli.it/nsd/BC/modelli/${year}${season}/preview/${model}_1.jpg`, {
        "credentials": "include",
        "headers": headers,
        "referrer": "https://websmart.brunellocucinelli.it/bcweb/WRTICMO10R.pgm",
        "method": "GET",
        "mode": "cors"
      })
      .then(res => res.buffer())

    console.log(buffer.length);

    if (buffer.length < 30) {
      console.log('getting alternative picture');
      buffer = await fetch(`https://websmart.brunellocucinelli.it/nsd/BC/modelli/${year}${season}/${model}_10.jpg`, {
          "credentials": "include",
          "headers": headers,
          "referrer": "https://websmart.brunellocucinelli.it/bcweb/WRTICMO10R.pgm",
          "method": "GET",
          "mode": "cors"
        })
        .then(res => res.buffer())
    }


    let b64 = Buffer.from(buffer).toString('base64')
    return `data:image/jpeg;base64,${b64}`;
  } catch (e) {
    console.log(e.message);
  }
}

async function getToBeReceived(cookie, model, color) {
  let receivables = {}

  let url = `https://websmart.brunellocucinelli.it/bcweb/WRTIRIO02R.pgm?TASK=dettaglio&BGACODICE=${model}&COLORE=${color}&TIPO=DARIC`;

  let detail = await fetch(url, {
    "credentials": "include",
    "headers": {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0",
      "Accept": "text/html, */*; q=0.01",
      "Accept-Language": "en-US,en;q=0.5",
      "X-Requested-With": "XMLHttpRequest",
      "cookie": cookie
    },
    "referrer": "https://websmart.brunellocucinelli.it/bcweb/WRTIRIO02R.pgm",
    "method": "GET",
    "mode": "cors"
  }).then(res => res.text())
  let $d = cheerio.load(detail)

  //let table = $d('table.mainlist:nth-child(24)');
  let thRow = $d(`.mainlist:nth-child(2) thead tr th`);
  let sizesRow = $d(`.mainlist tbody tr:nth-child(1) td`);


  sizesRow.each((i) => {
    let th = $d(thRow[i]).text();
    let size = $d(sizesRow[i]).text();
    if (size != '' && i != sizesRow.length - 1 && i != 0) {
      receivables[th] = size;
    }
  })
  return receivables;
}

async function getReceivables(cookie, year, season, model, color) {
  let html = await fetch("https://websmart.brunellocucinelli.it/bcweb/WRTIRIO02R.pgm", {
    "credentials": "include",
    "headers": {
      "cookie": cookie
    },
    "referrer": "https://websmart.brunellocucinelli.it/bcweb/WRTIRIO02R.pgm",
    "body": `task=filter&ww_fStagione=${year}${season}&ww_fBAPMODELL=${model}&ww_fBAPCOLORE=${color}&ww_fBAMORDTPL=CO&ww_fBAMORDTPL=C1&ww_fBAMORDTPL=C2&ww_fBAMORDTPL=C2N&ww_fBAMORDTPL=DR&ww_fBAMORDTPL=DS&ww_fBAMORDTPL=E&ww_fBAMORDTPL=EBA&ww_fBAMORDTPL=EBG&ww_fBAMORDTPL=EBI&ww_fBAMORDTPL=EBN&ww_fBAMORDTPL=EBP&ww_fBAMORDTPL=EBR&ww_fBAMORDTPL=EDG&ww_fBAMORDTPL=ENA&ww_fBAMORDTPL=ERA&ww_fBAMORDTPL=ETA&ww_fBAMORDTPL=EVG&ww_fBAMORDTPL=EVP&ww_fBAMORDTPL=EXG&ww_fBAMORDTPL=EXN&ww_fBAMORDTPL=G&ww_fBAMORDTPL=GB&ww_fBAMORDTPL=GRC&ww_fBAMORDTPL=GS&ww_fBAMORDTPL=L1&ww_fBAMORDTPL=L2&ww_fBAMORDTPL=N&ww_fBAMORDTPL=NB&ww_fBAMORDTPL=ND&ww_fBAMORDTPL=OTT&ww_fBAMORDTPL=P&ww_fBAMORDTPL=PIR&ww_fBAMORDTPL=PIS&ww_fBAMORDTPL=PM&ww_fBAMORDTPL=PS&ww_fBAMORDTPL=RCB&ww_fBAMORDTPL=RCN&ww_fBAMORDTPL=RCP&ww_fBAMORDTPL=RCR&ww_fBAMORDTPL=RCT&ww_fBAMORDTPL=RPR&ww_fBAMORDTPL=T&ww_fBAMORDTPL=TF&ww_fBAMORDTPL=TF1&ww_fBAMORDTPL=TN&ww_fBAMORDTPL=TNF&ww_fBAMORDTPL=T1&ww_fBAMORDTPL=U&ww_fBAMORDTPL=US&ww_fBAMORDTPL=USS&ww_fBAMORDTPL=YBC&ww_fBAMORDTPL=YRC&ww_fBAMORDTPL=YRP&ww_fBAMORDTPL=YRS&ww_fBAMORDTPL3=GP1&ww_fBAMORDTPL3=GR&ww_fBAMORDTPL3=GRT&ww_fBAMORDTPL3=GR1&ww_fBAMORDTPL3=GR2&ww_fBAMORDTPL3=GR3&ww_fBAMORDTPL3=GT1&ww_fBAMORDTPL3=GUT&ww_fBAMORDTPL3=GU1&ww_fBAMORDTPL3=G10&ww_fBAMORDTPL3=G11&ww_fBAMORDTPL3=NR&ww_fBAMORDTPL3=NR1&ww_fBAMORDTPL3=PGR&ww_fBAMORDTPL5=T&ww_fBAMORDTPL5=TF&ww_fBAMORDTPL5=TF1&ww_fBAMORDTPL5=TN&ww_fBAMORDTPL5=TNF&ww_fBAMORDTPL5=T1&ww_fBAMORDTPL6=GP1&ww_fBAMORDTPL6=GRT&ww_fBAMORDTPL6=GT1&ww_fBAMORDTPL6=PGR&ww_fBAMORDTPL2=BS1&ww_fBAMORDTPL2=RB&ww_fBAMORDTPL2=R1&ww_fBAMORDTPL2=R1Q&ww_fBAMORDTPL2=R13&ww_fBAMORDTPL2=R2&ww_fBAMORDTPL2=R2Q&ww_fBAMORDTPL2=R3&ww_fBAMORDTPL2=R4&ww_fBAMORDTPL2=R5&ww_fBAMORDTPL2=R50&ww_fBAMORDTPL2=R51&ww_fBAMORDTPL2=R6&ww_fBAMORDTPL2=R7&ww_fBAMORDTPL2=R8&ww_fBAMORDTPL2=R9&ww_fBAMORDTPL4=Z&ww_fBAMORDTPL4=ZD&ww_fStagione2=&ww_fTessuto=&ww_fBAMCLIENT=&ww_fGCDSC1=&clienti=1006000&ww_fINCLUDI=I&ww_fBTFPTIPOL=DOS&ww_fBTFPTIPOL=FRANCH_MONO&ww_fBTFPTIPOL=FRANCH_MULTI&tipo_buoni=BUONI&ww_fBCRUBICAZ=DISPOAI&ww_fBCRUBICAZ=DISPOPE&ww_fBCRUBICAZ=DISPOSM&ww_fBCRUBICAZ=LSDISPO&ww_fBCRUBICAZ=LSTYLE&ww_fBCRUBICAZ=MAGIONE&ww_fBCRUBICAZ=NEG1&ww_fBCRUBICAZ=NEG2&ww_fBCRUBICAZ=STK16-1&ww_fBCRUBICAZ=STK16-2&ww_fBCRUBICAZ=XDISPO&flgTipFil=S&flgModello=S%3E&flgColore=S`,
    "method": "POST",
    "mode": "cors"
  }).then(res => res.text())

  let $ = cheerio.load(html);

  //let rnd = $('#prevlinktop')[0].attribs.href
  //key to store in url for future requests
  //let key = rnd.slice(rnd.search('rnd') + 4, rnd.search('&task'));

  let total = $(`tr.altcol1:nth-child(2) > td:nth-child(17)`).text()
  // IF NOT EMPTY FETCH SIZES
  let receivables
  if (total != '') {
    receivables = await getToBeReceived(cookie, model, color)
  }
  return {
    'total': total,
    'receivables': receivables
  };
};

async function getShops(cookie, year, season, model, color, size) {
  let sizes = {}
  // CHECK AVAILABLE SIZES
  let fetchUrl = `https:/` + `/websmart.brunellocucinelli.it/bcweb/WRTICMO10R.pgm?TASK=dett&BCRSTGANN=${year}&BCRSTGSIG=${season}&BCRMODELL=${model}&BCRCOLORE=${color}&idx_taglia=${size}`;

  await fetch(fetchUrl, {
      "credentials": "include",
      "headers": {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "cookie": cookie
      },
      "referrer": "https://websmart.brunellocucinelli.it/bcweb/WRTICMO10R.pgm",
      "method": "GET",
      "mode": "cors"
    })
    .then(res => res.text())
    .then(text => {
      let $r = cheerio.load(text)
      // TODO: order the results for size
      let sizeLabel = $r('table.mainlist:nth-child(1) > thead:nth-child(1) > tr:nth-child(4) > th:nth-child(2)').text().trim();
      sizes[size] = {}
      sizes[size][sizeLabel] = []

      let shops = $r('table.mainlist:nth-child(2) > tbody:nth-child(2) > tr > td:nth-child(2)')

      for (let z = 0; z < shops.length; z++) {
        sizes[size][sizeLabel].push($r(shops[z]).text())
      }
    });
  return sizes;
}

async function availabilityRequest(cookie, model, color) {

  data.results = {};

  let headers = {
    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Upgrade-Insecure-Requests": "1",
    "Cookie": cookie
  }
  try {

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
      .slice(1);

    if (rows.length === 0) {
      return 'Model not found!'
    }
    // data store in object
    let skus = {};
    let sizeRow;

    //FUNCTION THAT WILL BE INSIDE THE LOOP
    let avb = async (i) => {
      let $element = $(rows[i]);
      // if it encounters th, update the sizeRow
      if ($element.find($('th')).length > 0) {
        sizeRow = $(rows[i]).text().replace(/(\r\n|\n|\r)/gm, "").trim().split(' ').filter((size) => {
          return size != "" && size != "Colore" && size != "Stagione" && size != "Modello";
        })
      }

      let sku = {};
      //If theres an actual result in the row (check for td)
      if ($element.find($('td')).length > 0) {
        let tds = Object.values($element.find($('td')));

        // if theres a result run code
        if ($(tds[0]).text().split(' ') != '') {
          sku.year = $(tds[0]).text().split(' ')[1].trim().slice(-2);
          sku.season = $(tds[0]).text().search('A/I') === 0 ? '2' : '1';
          sku.model = $(tds[2]).find('a').text().split('+')[1].trim();
          sku.color = tds[3].children[0]['data'];
          sku.descr = $(tds[4]).text();
          sku.string = sku.year + sku.season + ' ' + sku.model + ' ' + sku.color;
          sku.receivables = {}
          sku.sizesForRequests = []
          sku.sizes = []

          // Loop over the available sizes
          for (var y = 0; y < tds.length; y++) {
            let td = tds[y]

            if ($(td).attr('onclick') != undefined) {

              // get the number to use for Requests
              let sizeForRequests = $(td).attr('onclick').split(',')[4].slice(1, 3)
              sku.sizesForRequests.push(sizeForRequests)
              // get the number from the size to use as index of sizeRow
              let reqSize = parseInt(
                $(td).attr('onclick').split(',')[4].slice(1, 3), 10
              ) - 1;
              sku.sizes.push(sizeRow[reqSize])
            }
          }

          // STORE HERE INFO ON SINGLE SKU
          data.results[i] = {}
          data.results[i] = sku;
          return sku
        }
      }
    }

    // Loop over the results of the query
    let promises = []

    for (let i = 0; i < rows.length; i++) {
      promises.push(avb(i));
    }
    let pResults = [];
    await Promise.all(promises)
      .then(res => pResults.push(res))

    // pResults.forEach((item, i) => {
    //   data.results[i] = item;
    // });

    return data.results

  } catch (e) {
    console.log(e.message);
  }
}

async function getAvb(cookie, model, color, withImage) {
  try {
    let results = await availabilityRequest(cookie, model, color);
    return results
  } catch (e) {
    console.log(e.message);
  }
}

module.exports.getAvb = getAvb;
module.exports.getShops = getShops;
module.exports.getCookie = getCookie;
module.exports.getImage = getImage;
module.exports.getReceivables = getReceivables;
module.exports.getPrice = getPrice;