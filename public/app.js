const resultsElement = document.querySelector('.results');
const button = document.querySelector('.search-button');
const imageSearch = document.querySelector('.image-search-button')
const loader = document.querySelector('.loader');
const loginPopout = document.querySelectorAll('.user-icon');
const loginButton = document.querySelector('.login-button');

//check if session exists
let session;
async function loginCheck(e) {
  try {
    session = await fetch('/logged')
      .then(res => res.json())
    if (session.smurf) {
      classy('.user-input', 'hidden', 'add')
    }
    if (session.user) {
      console.log(session);
      document.querySelector('div.user').textContent = session.user;
    }
  } catch {
    console.log(e.message);
  }
}

loginCheck();

// SIDEBAR DROPDOWN
loginPopout.forEach(item => {
  item.addEventListener('click', () => {
    classy(document.querySelector('.user-input'), 'hidden', 'toggle')
  })
});

// LOGIN
loginButton.onclick = async () => {
  if (!session.user) {
    await getCookie()
  }
}



// GET AVB
button.addEventListener('click', async () => {
  if (session.user) {
    let model = document.querySelector('.model-input').value === '' ? 'm' : document.querySelector('.model-input').value
    let color = document.querySelector('.color-input').value === '' ? 'c' : document.querySelector('.color-input').value
    let user = document.querySelector('.user').value

    let start = Date.now();
    await getAvb(user, model, color)
    let end = Date.now()

    let elapsed = (end - start) / 1000
    console.log(`Elapsed time: ${elapsed}`);
  } else {
    document.querySelector('.nav .user-icon').click()
  }
})
// GET picture
imageSearch.onclick = async () => {
  if (session.user) {
    await getImage()
  } else {
    document.querySelector('.nav .user-icon').click()
  }
}

async function getCookie() {
  let user = document.querySelector('.user-inputs > input:nth-child(2)').value
  let pwd = document.querySelector('.user-inputs > input:nth-child(3)').value

  await fetch(`api/login/${user}/${pwd}`)
    .then(res => res.json())

  loginCheck();
}

async function getImage() {
  let model = document.querySelector('.model-input').value
  let img
  if (!document.querySelector('.sku-picture')) {
    img = document.createElement('img')
    img.classList.add('sku-picture')
    resultsElement.prepend(img)
  } else {
    img = document.querySelector('.sku-picture')
    img.src = '';
  }
  classy(loader, 'hidden', 'remove');
  await fetch(`api/image/${model}`)
    .then(res => res.text())
    .then(url => img.src = url)
  classy(loader, 'hidden', 'add');
}

async function getAvb(user, model, color) {
  resultsElement.innerHTML = '';
  classy(loader, 'hidden', 'remove');
  const res = await fetch(`/api/avb/${model}/${color}`)
    .then(response => response.json())
  console.log(res);
  classy(loader, 'hidden', 'add');

  let skus = Object.values(res);
  console.log(skus);
  // PRINT THE DATA IN A UL TAG
  skus.forEach((sku, i) => {
    if (sku != res.picture) {
      let skusWrapper = make('div', `sku-wrapper sku-wrapper-${i}`, resultsElement);
      let skuElement = make('div', `sku sku-${i}`, skusWrapper)
      skuElement.textContent = `${sku.string}`;

      // getShops
      let sizesWrapper = make('ul', 'sizes-wrapper', skusWrapper);

      skuElement.addEventListener('click', async (event) => {
        // FETCH SHOPS if not already fetched
        if (!skuElement.classList.contains('fetched')) {
          classy(skuElement, 'fetched', 'add');
          let dotLoader = make('img', 'sizes-loader', skuElement)
          dotLoader.src = "../loading.gif";
          // array for promises
          let shopsPromises = [];

          for (var i = 0; i < sku.sizesForRequests.length; i++) {
            let shopsObject = fetch(`/api/${sku.year}/${sku.season}/${sku.model}/${sku.color}/${sku.sizesForRequests[i]}`)
              .then(res => res.json());
            shopsPromises.push(await shopsObject)
          }
          let res = []
          await Promise.all(shopsPromises)
            .then(shops => {
              res = shops;
            })
          // print out the shops
          res.forEach((item, i) => {
            let index = Object.keys(item)[0];

            let size = Object.keys(item[index])

            let sizeLabel = make('li', `size-${i}`, sizesWrapper)
            sizeLabel.innerHTML = `<label class="label label-size">${size}</label> `;
            let sizeList = make('ul', 'size=list', sizeLabel)

            let shops = Object.values(item[index])[0]
            shops.forEach(item => {
              let shop = make('li', 'shop', sizeList)
              shop.textContent = item
            });

          });
          dotLoader.classList.add('hidden')
        }
      });

      // create some labels
      let labelsWrapper = make('div', 'row labels-wrapper flex', skuElement)
      // print color desc
      let colorDescription = make('div', 'label label-description', labelsWrapper);
      colorDescription.textContent = `${sku.descr}`;

      // print the price
      let priceElement = make('div', 'label label-price', labelsWrapper);
      priceElement.textContent = '€' + sku.price;

      // let receivableSizes = Object.keys(sku.receivables);
      // let receivableQty = Object.values(sku.receivables);
      let totalReceivables = sku.totalReceivables

      if (totalReceivables) {
        let receivable = make('div', 'label total-receivables label-receivables', labelsWrapper);
        receivable.setAttribute('model', sku.model);
        receivable.setAttribute('color', sku.color);
        receivable.setAttribute('rnd', sku.rnd);
        receivable.textContent = totalReceivables + ' da ricevere!';
        labelsWrapper.innerHTML += `<div></div>`;
      }

      sku.sizes.forEach(item => {
        let sizeElement = make('div', 'label label-size', labelsWrapper);
        sizeElement.textContent = item
      });
    }
  });
  collapsibles('.sku', '.sizes-wrapper');

  document.querySelectorAll('.total-receivables').forEach((item) => {
    item.addEventListener('click', async (event) => {
      let model = event.target.getAttribute('model')
      let color = event.target.getAttribute('color')
      let rnd = event.target.getAttribute('rnd')
      console.log(rnd);
      let receivables = await fetch(`api/toReceive/${model}/${color}/${rnd}`)
        .then(res => res.json());
      console.log(receivables);
      if (receivables) {
        item.textContent = ''
        Object.keys(receivables).forEach(s => {
          let size = s;
          let qty = Object.values(receivables[s])
          item.textContent += `${qty}/${size} `
        });
      }
    }, true);
  });

}

// function typedArrayToURL(typedArray, mimeType) {
//   return URL.createObjectURL(new Blob([typedArray.buffer], {
//     type: mimeType
//   }))
// }

// Collapsible utilities
function collapsibles(parent, child) {
  let children = document.querySelectorAll(child);
  children.forEach(item => {
    classy(item, 'collapsed', 'add')
    item.style.transition = 'all 0.3s cubic-bezier(.47,0,.74,.71) 0s';
  });

  document.querySelectorAll(parent).forEach((item, i) => {
    item.onclick = (event) => {
      if (!event.target.classList.contains('total-receivables')) {
        classy(children[i], 'collapsed', 'toggle')
        classy(children[i], 'collapsible', 'toggle')
        if (item.classList.contains('collapsible')) {
          children[i].style.maxHeight = item.scrollHeight + 'px';
        }
      }
    }
  });
}

function make(element, classes, parent) {
  let e = document.createElement(element);
  e.setAttribute('class', classes)
  parent.appendChild(e);
  return e;
}

function classy(elem, c, addRemoveToggle) {
  if (typeof elem === 'object') {
    elem.classList[addRemoveToggle](c)
  } else {
    let e = document.querySelectorAll(elem)
    e.forEach((item) => {
      item.classList[addRemoveToggle](c)
    });
  }
}