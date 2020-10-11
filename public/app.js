const resultsElement = document.querySelector('.results');
const button = document.querySelector('.search-button');
const imageSearch = document.querySelector('.image-search-button')
const loader = document.querySelector('.loader');
const loginPopout = document.querySelectorAll('.user-icon');
const loginButton = document.querySelector('.login-button');

//check if session exists

async function loginCheck(e) {
  try {
    let session = await fetch('/logged')
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
  await getCookie()
}

// GET AVB
button.addEventListener('click', async () => {
  let model = document.querySelector('.model-input').value === '' ? 'm' : document.querySelector('.model-input').value
  let color = document.querySelector('.color-input').value === '' ? 'c' : document.querySelector('.color-input').value
  let user = document.querySelector('.user').value

  let start = Date.now();
  await getAvb(user, model, color)
  let end = Date.now()

  let elapsed = (end - start) / 1000
  console.log(`Elapsed time: ${elapsed}`);
})
// GET picture
imageSearch.onclick = async () => {
  await getImage()
}

async function getCookie() {
  let user = document.querySelector('.user-inputs > input:nth-child(2)').value
  let pwd = document.querySelector('.user-inputs > input:nth-child(3)').value

  await fetch(`api/login/${user}/${pwd}`)
    .then(res => res.json())

  loginCheck();
}

async function getImage() {
  let user = document.querySelector('.user').value
  let model = document.querySelector('.model-input').value
  let img
  if (!document.querySelector('.sku-picture')) {
    img = document.createElement('img')
    img.classList.add('sku-picture')
    resultsElement.prepend(img)
  } else {
    img = document.querySelector('.sku-picture')
  }
  classy(loader, 'hidden', 'remove');
  await fetch(`api/${user}/image/${model}`)
    .then(res => res.text())
    .then(url => img.src = url)
  classy(loader, 'hidden', 'add');
}

async function getAvb(user, model, color) {
  resultsElement.innerHTML = '';
  classy(loader, 'hidden', 'remove');
  const res = await fetch(`/api/${user}/avb/${model}/${color}`)
    .then(response => response.json())
  console.log(res);
  classy(loader, 'hidden', 'add');


  // REMOVED FOR NOW

  // if (withImage === 1) {
  //   console.log(`displaying image: ${withImage}`);
  //   let img = make('img', 'sku-picture', resultsElement)
  //   img.src = res.picture;
  // }

  // WRITE TO FILE AND THEN USE IT AS src

  // const url = typedArrayToURL(res.picture, 'image/jpeg');
  // console.log(url);
  // let img = make('img', 'sku-picture', resultsElement)
  // img.src = url
  // setTimeout(() => {
  //   img.src = 'picture.jpg'
  // }, 1500)




  let skus = Object.values(res);

  // PRINT THE DATA IN A UL TAG
  skus.forEach((sku, i) => {
    if (sku != res.picture) {
      let skusWrapper = make('div', `sku-wrapper sku-wrapper-${i}`, resultsElement);
      let skuElement = make('div', `sku sku-${i}`, skusWrapper)
      skuElement.textContent = `${sku.string}`;



      let labelsWrapper = make('div', 'row labels-wrapper flex', skuElement)
      // print color desc
      let colorDescription = make('div', 'label label-description', labelsWrapper);
      colorDescription.textContent = `${sku.descr}`;

      // print the price
      let priceElement = make('div', 'label label-price', labelsWrapper);
      priceElement.textContent = '€' + sku.price;

      let receivableSizes = Object.keys(sku.receivables);
      let receivableQty = Object.values(sku.receivables);

      if (receivableSizes.length > 0) {
        receivableSizes.forEach((item, i) => {
          let receivable = make('div', 'label label-receivables', labelsWrapper);
          receivable.textContent = `${receivableQty[i]}/${receivableSizes[i]}`;
        });

      }

      let sizesWrapper = make('div', 'sizes-wrapper', skusWrapper);
      let sizesList = make('ul', 'size-list', sizesWrapper);

      // COLLAPSE sizesWrapper ON CLICK

      // skuElement.addEventListener('click', () => {
      //   classy(sizesWrapper, 'collapsed', 'toggle')
      // })

      let sizes = Object.keys(sku.sizes)
      let sizeLabels = Object.values(sku.sizes)

      sizes.forEach((size, y) => {
        let sizeLabel = Object.keys(sizeLabels[y])
        let sizeElement = make('li', `size size-${y}`, sizesList);
        sizeElement.innerHTML = ` <label class="label-size"> ${sizeLabel} </label>`;

        let shopWrapper = make('ul', 'shops-wrapper', sizesList);

        let shops = Object.values(sku.sizes[size])
        shops[0].forEach(item => {
          let shopElement = make('li', 'shop', shopWrapper);
          shopElement.textContent = item;
        });
      });
    }
  });
  collapsibles('.sku', '.sizes-wrapper');
  // collapsibles('.size', '.shops-wrapper');
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
    item.onclick = () => {
      classy(children[i], 'collapsed', 'toggle')
      classy(children[i], 'collapsible', 'toggle')
      if (item.classList.contains('collapsible')) {
        children[i].style.maxHeight = item.scrollHeight + 'px';
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