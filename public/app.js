const resultsElement = document.querySelector(".results");
const button = document.querySelector(".search-button");
const loader = document.querySelector(".loader");
const loginPopout = document.querySelectorAll(".user-icon");
const loginButton = document.querySelector(".login-button");

//check if session exists
let session;

async function loginCheck(e) {
  try {
    session = await fetch("/logged").then(res => res.json());
    if (session.smurf && session.user) {
      classy(".user-input", "hidden", "add");
      console.log(session);
      document.querySelector("div.user").textContent = session.user;
      
      // HIDE THE LOGIN INPUTS AND ADD A LOGOUT BUTTON
      classy(".user-inputs", "hidden", "add");
      
      if(!document.querySelector('.logout')) {
        let logout = ("input", "button logout", document.querySelector('.user-input'))
        logout.setAttribute('value', 'Logout');
        logout.setAttribute('type', 'submit');
        logout.addEventListener('click', () => {
          session.user = false;
          session.smurf = false;
        })
        
      }            
    }
  } catch {
    console.log(e.message);
  }
}

loginCheck();

// SIDEBAR DROPDOWN
loginPopout.forEach(item => {
  item.addEventListener("click", () => {
    classy(document.querySelector(".user-input"), "hidden", "toggle");
  });
});

// LOGIN
loginButton.onclick = async () => {
  if (!session.user) {
    await getCookie();
  }
};

// GET AVB
button.addEventListener("click", async () => {
  if (session.user) {
    let model =
      document.querySelector(".model-input").value === ""
        ? "m"
        : document.querySelector(".model-input").value;
    let color =
      document.querySelector(".color-input").value === ""
        ? "c"
        : document.querySelector(".color-input").value;
    let user = document.querySelector(".user").value;

    let start = Date.now();
    await getAvb(user, model, color);
    let end = Date.now();

    let elapsed = (end - start) / 1000;
    console.log(`Elapsed time: ${elapsed}`);
  } else {
    document.querySelector(".nav .user-icon").click();
  }
});
// GET picture
// imageSearch.onclick = async () => {
//   if (session.user) {
//     await getImage()
//   } else {
//     document.querySelector('.nav .user-icon').click()
//   }
// }

async function getCookie() {
  let user = document.querySelector(".user-inputs input:nth-child(1)").value;
  let pwd = document.querySelector(".user-inputs input:nth-child(2)").value;

  await fetch(`api/login/${user}/${pwd}`).then(res => res.json());

  loginCheck();
}

/* 
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
  await fetch(`api/image/${year}/${season}${model}`)
    .then(res => res.text())
    .then(url => img.src = url)
  classy(loader, 'hidden', 'add');
} 
*/

async function getAvb(user, model, color) {
  resultsElement.innerHTML = "";

  classy(loader, "hidden", "remove");
  const res = await fetch(`/api/avb/${model}/${color}`).then(response =>
    response.json()
  );
  console.log(res);
  classy(loader, "hidden", "add");

  let skus = Object.values(res);

  // PRINT THE DATA IN A UL TAG

  skus.forEach((sku, i) => {
    let skusWrapper = make(
      "div",
      `sku-wrapper sku-wrapper-${i}`,
      resultsElement
    );
    let skuElement = make("div", `sku sku-${i}`, skusWrapper);
    let firstRow = make("div", "sku-title flex row", skuElement);
    firstRow.setAttribute("style", "margin: 10px");
    firstRow.innerHTML = `<p style="margin-bottom: 0px">${sku.string}</p>`;

    // create img for the picture
    let imageElement = document.createElement("img");
    imageElement.setAttribute("class", `sku-picture sku-picture-${i} hidden`);
    imageElement.src = "../loading.gif";
    firstRow.append(imageElement);

    let svgWrapper = make("div", "get-image", firstRow);
    const svgImage = `<svg class="svg-icon get-image" viewBox="0 0 20 20">
        <path fill="none" d="M6.523,7.683c0.96,0,1.738-0.778,1.738-1.738c0-0.96-0.778-1.738-1.738-1.738c-0.96,0-1.738,0.778-1.738,1.738
        C4.785,6.904,5.563,7.683,6.523,7.683z M5.944,5.365h1.159v1.159H5.944V5.365z M18.113,0.729H1.888
        c-0.64,0-1.159,0.519-1.159,1.159v16.224c0,0.64,0.519,1.159,1.159,1.159h16.225c0.639,0,1.158-0.52,1.158-1.159V1.889
        C19.271,1.249,18.752,0.729,18.113,0.729z M18.113,17.532c0,0.321-0.262,0.58-0.58,0.58H2.467c-0.32,0-0.579-0.259-0.579-0.58
        V2.468c0-0.32,0.259-0.579,0.579-0.579h15.066c0.318,0,0.58,0.259,0.58,0.579V17.532z M15.91,7.85l-4.842,5.385l-3.502-2.488
        c-0.127-0.127-0.296-0.18-0.463-0.17c-0.167-0.009-0.336,0.043-0.463,0.17l-3.425,4.584c-0.237,0.236-0.237,0.619,0,0.856
        c0.236,0.236,0.62,0.236,0.856,0l3.152-4.22l3.491,2.481c0.123,0.123,0.284,0.179,0.446,0.174c0.16,0.005,0.32-0.051,0.443-0.174
        l5.162-5.743c0.238-0.236,0.238-0.619,0-0.856C16.529,7.614,16.146,7.614,15.91,7.85z"></path></svg>`;
    svgWrapper.innerHTML = svgImage;

    // GET picture by clicking on the svg
    svgWrapper.addEventListener("click", async e => {
      e.preventDefault();
      e.stopPropagation();
      let img = document.querySelector(`.sku-picture-${i}`);
      if (img.src = "../loading.gif") {
        img.classList.remove("hidden");
        let pic = await fetch(
          `api/image/${sku.year}/${sku.season}/${sku.model}`
        )
          .then(res => res.text())
          .then(url => (img.src = url));
      }
    });

    // getShops
    let sizesWrapper = make("ul", "sizes-wrapper", skusWrapper);

    skuElement.addEventListener("click", async event => {
      // FETCH SHOPS if not already fetched
      if (!skuElement.classList.contains("fetched")) {
        classy(skuElement, "fetched", "add");
        let dotLoader = make("img", "sizes-loader", skuElement);
        dotLoader.src = "../loading.gif";
        // array for promises
        let shopsPromises = [];

        for (var y = 0; y < sku.sizesForRequests.length; y++) {
          let shopsObject = fetch(
            `/api/${sku.year}/${sku.season}/${sku.model}/${sku.color}/${sku.sizesForRequests[y]}`
          ).then(res => res.json());
          shopsPromises.push(await shopsObject);
        }

        let res = [];

        await Promise.all(shopsPromises).then(shops => {
          res = shops;
        });

        // print out the shops

        res.forEach((item, z) => {
          let index = Object.keys(item)[0];

          let size = Object.keys(item[index]);

          let sizeLabel = make("li", `size-${z}`, sizesWrapper);
          sizeLabel.innerHTML = `<label class="label label-size">${size}</label>`;
          let sizeList = make("ul", "size=list", sizeLabel);

          let shops = Object.values(item[index])[0];
          shops.forEach(item => {
            let shop = make("li", "shop", sizeList);
            if (item == "NEGOZIO SOLOMEO") {
              shop.classList.add("negsol");
            }
            shop.textContent = item;
          });
        });
        dotLoader.classList.add("hidden");
        // sizeswrapper set maxHeight for the first time
        sizesWrapper.style.maxHeight = sizesWrapper.scrollHeight + "px";
      }
    });

    // create some labels
    let labelsWrapper = make("div", "row labels-wrapper flex", skuElement);
    // print color desc
    let colorDescription = make(
      "div",
      "label label-description",
      labelsWrapper
    );
    colorDescription.textContent = `${sku.descr}`;

    // print the price
    let priceElement = make("div", "label label-price", firstRow);
    let priceGetter = async () => {
      let res = await fetch(
        `/api/price/${sku.year}/${sku.season}/${sku.model}`
      ).then(price => price.json());
      priceElement.textContent = "€" + res;
    };
    priceGetter();

    let getReceivables = async () => {
      let url = `/api/request/${sku.year}/${sku.season}/${sku.model}/${sku.color}`;
      console.log(url);
      let res = await fetch(url).then(r => r.json());
      if (res.total != "") {
        let total = make("div", "label label-receivables", labelsWrapper);
        total.textContent = res.total + " da ricevere: ";
        total.setAttribute("model", sku.model);
        total.setAttribute("color", sku.color);

        let receivableSizes = Object.keys(res.receivables);
        let receivableQty = Object.values(res.receivables);
        console.log(
          `${sku.year}/${sku.season}/${sku.model} ${receivableSizes.length} `
        );
        receivableSizes.forEach((item, j) => {
          total.innerHTML += `<div class="label label-size">${receivableQty[j]}/${item} </div>`;
          // console.log(total.innerHTML);
        });
      }
    };
    getReceivables();

    sku.sizes.forEach(item => {
      let sizeElement = make("div", "label label-size", labelsWrapper);
      sizeElement.textContent = item;
    });
  });
  collapsibles(".sku", ".sizes-wrapper");

  document.querySelectorAll(".total-receivables").forEach(item => {
    item.addEventListener(
      "click",
      async event => {
        let model = event.target.getAttribute("model");
        let color = event.target.getAttribute("color");
        let rnd = event.target.getAttribute("rnd");
        let receivables = await fetch(
          `api/toReceive/${model}/${color}/${rnd}`
        ).then(res => res.json());
        console.log(receivables);
        if (receivables) {
          item.textContent = "";
          Object.keys(receivables).forEach(s => {
            let size = s;
            let qty = Object.values(receivables[s]);
            item.textContent += `${qty}/${size} `;
          });
        }
      },
      true
    );
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
    classy(item, "collapsed", "add");
  });

  document.querySelectorAll(parent).forEach((item, i) => {
    item.onclick = event => {
      classy(children[i], "collapsed", "toggle");
      classy(children[i], "collapsible", "toggle");
      if (children[i].classList.contains("collapsible")) {
        let h = children[i].scrollHeight;
        children[i].setAttribute("style", `max-height: ${h}px;`);
      } else {
        children[i].setAttribute("style", `max-height: 0px`);
      }
    };
  });
}

function make(element, classes, parent) {
  let e = document.createElement(element);
  e.setAttribute("class", classes);
  parent.appendChild(e);
  return e;
}

function classy(elem, c, addRemoveToggle) {
  if (typeof elem === "object") {
    elem.classList[addRemoveToggle](c);
  } else {
    let e = document.querySelectorAll(elem);
    e.forEach(item => {
      item.classList[addRemoveToggle](c);
    });
  }
}
