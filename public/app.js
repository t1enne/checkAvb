const resultsElement = document.querySelector('.results');
const button = document.querySelector('button');
const loader = document.querySelector('.loader');

button.addEventListener('click', async () => {
  let model = document.querySelector('.model-input').value === '' ? 'm' : document.querySelector('.model-input').value
  let color = document.querySelector('.color-input').value === '' ? 'c' : document.querySelector('.color-input').value
  let withImage = document.querySelector('.only-image').checked === true ? 1 : 0;

  let start = Date.now();
  await getAvb(model, color, withImage)
  let end = Date.now()

  let elapsed = (end - start) / 1000
  console.log(`Elapsed time: ${elapsed}`);
})

async function getAvb(model, color, withImage) {
  resultsElement.innerHTML = '';
  classy(loader, 'hidden', 'remove');
  const res = await fetch(`/api/avb/${model}/${color}/img=${withImage}`)
    .then(response => response.json())
  classy(loader, 'hidden', 'add');



  if (withImage === 1) {
    console.log(`displaying image: ${withImage}`);
    let img = make('img', 'sku-picture', resultsElement)
    img.src = res.picture;
  }

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


      // print the price
      let priceElement = make('div', 'label label-price pull-right', skuElement);
      priceElement.textContent = '€' + sku.price;

      // print color desc
      let colorDescription = make('div', 'label label-description pull-right', skuElement);
      colorDescription.textContent = `${sku.descr}`;

      let sizesWrapper = make('div', 'sizes-wrapper', skusWrapper);
      let sizesList = make('ul', 'size-list', sizesWrapper);

      // COLLAPSE sizesWrapper ON CLICK
      skuElement.addEventListener('click', () => {
        classy(sizesWrapper, 'hidden', 'toggle')
      })
      let sizes = Object.keys(sku.sizes)
      let sizeLabels = Object.values(sku.sizes)

      sizes.forEach((size, y) => {
        let sizeLabel = Object.keys(sizeLabels[y])
        let sizeElement = make('li', `size size-${y}`, sizesList);
        sizeElement.innerHTML = ` <label class="label-size"> ${sizeLabel} </label>`;

        let shopWrapper = make('ul', 'shops-wrapper', sizesList);

        let shops = Object.values(sku.sizes[size])
        shops.forEach((item) => {
          let shopElement = make('li', 'shop', shopWrapper);
          shopElement.textContent = item;
        });
      });
    }
  });
}

function typedArrayToURL(typedArray, mimeType) {
  return URL.createObjectURL(new Blob([typedArray.buffer], {
    type: mimeType
  }))
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