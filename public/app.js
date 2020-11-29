import 'regenerator-runtime/runtime';
import m from 'mithril';

import {
  Button,
  Input,
  Icon,
  IconName,
  Icons,
  FocusManager,
  Form,
  FormGroup,
  FormLabel,
  Card,
  Collapse,
  Classes,
  ControlGroup,
  Tag,
  Popover,
  PopoverInteraction,
  PopoverPosition
} from 'construct-ui';
import '../node_modules/construct-ui/lib/index.css'
FocusManager.alwaysShowFocus();
import Tabs from '/components/Tabs';

const resultsElement = document.querySelector('.results');
const loader = document.querySelector('.loader');

// Loader SVG
m.mount(loader, {
  view: () => {
    return m(`svg[version='1.1'][id='L9'][xmlns='http://www.w3.org/2000/svg'][xmlns:xlink='http://www.w3.org/1999/xlink'][x='0px'][y='0px'][viewBox='0 0 100 100'][enable-background='new 0 0 0 0'][xml:space='preserve']`, m("path[fill='black'][d='M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50']", m("animateTransform[attributeName='transform'][attributeType='XML'][type='rotate'][dur='1s'][from='0 50 50'][to='360 50 50'][repeatCount='indefinite']")))
  }
})

let session;

let Login = {
  view: () => {
    return [
      m('.logo-bg', {
        style: 'width: auto; height: 100px; background: url("/logo.86ce68ea.svg") no-repeat center;'
      }),
      m(Input, {
        style: 'display:block;margin:5px auto;',
        contentLeft: m(Icon, {
          name: Icons.USER
        }),
        placeholder: 'Your ASWEB Username',
        autocomplete: 'username'
      }),
      m(Input, {
        style: 'display:block;margin:5px auto;',
        contentLeft: m(Icon, {
          name: Icons.LOCK
        }),
        placeholder: 'Password',
        type: 'password',
        autocomplete: "current-password"
      }),
      m(Button, {
        label: 'LOGIN',
        style: 'display:block;margin:5px auto;',
        type: 'submit',
        intent: 'primary',
        onclick: async (e) => {
          e.preventDefault();
          if (!session.user) {
            await getCookie()
          }
        }
      })
    ]
  }
}

//check if session exists
async function loginCheck() {
  try {

    session = await fetch('/logged').then(res => res.json())
    if (session.smurf && session.user) {
      classy('form.login', 'd-none', 'add')
      classy('.user-personal-bucket', 'd-none', 'remove');
      if (!document.querySelector('.user-panel').classList.contains('hidden')) {
        classy('.user-panel', 'hidden', 'add')
      }
      console.log(session);
      document.querySelectorAll('.login-user').forEach(item => {
        item.textContent = session.user
      })
    } else {
      classy('.user-panel', 'hidden', 'remove')
      classy('form.login', 'd-none', 'remove')
    }
  } catch (e) {
    console.log(e.message);
  }
}

loginCheck();

m.mount(document.querySelector('form.login'), Login)

async function getCookie() {
  // let user = document.querySelector('form.login > div.cui-input:nth-child(2) > input:nth-child(2)').value
  // let pwd = document.querySelector('form.login div.cui-input:nth-child(3) > input:nth-child(2)').value
  let user = 'ntaov'
  let pwd = 'ntaov456'

  await fetch(`api/login/${user}/${pwd}`).then(res => res.json()).then(json => console.log(json))

  user = ''
  pwd = ''

  loginCheck();
}

// userIcons
m.mount(document.querySelector('.user-panel-dropdown'), {
  view: () => {
    return [m('.user-icons', {
      onclick: () => {
        classy('.user-panel', 'hidden', 'toggle')
        document.querySelector('#radio1').click()
      }
    }, m(Icon, {
      name: Icons.CHEVRON_DOWN,
      size: 'xl'
    }), m(Icon, {
      name: Icons.USER,
      size: 'xl'
    }), m('.login-user'))]

  }
})

m.mount(document.querySelector('.user-personal-bucket'), Tabs)

let resultsArray;

let SearchForm = {
  loading: false,
  clearFields: () => {
    // if (document.querySelectorAll('.size-wrapper')) {
    //   document.querySelectorAll('.size-wrapper').forEach(item => item.textContent = '')
    // }
    // if (document.querySelectorAll('.label-price')) {
    //   document.querySelectorAll('.label-price').forEach(item => item.textContent = '')
    // }
    resultsArray = []
  },
  view: (vnode) => {
    return m("form", [
      m("div.model",
        //m("input.model-input.twelve.columns[placeholder='Model'][type='text']")
        m(Input, {
          class: 'model-input',
          placeholder: 'Model'
        })),
      m("div.color",
        // m("input.color-input.twelve.columns[placeholder='Color'][type='text']")
        m(Input, {
          class: 'color-input',
          placeholder: 'Color'
        })),
      m(".row.rower", ),
      m("div.row.buttons-group", [
        // GET AVB
        // m("Button.clear-button.button[type='button'][style='width:150px;margin:5px 10px;']",
        m(Button, {
          iconLeft: Icons.DELETE,
          label: "Clear",
          onclick: () => {
            document.querySelector('.model-input > input').value = '';
            document.querySelector('.color-input > input').value = '';
          }
        }),
        m(Button, {
          iconLeft: Icons.SEARCH,
          label: 'Search',
          type: 'submit',
          loading: vnode.state.loading,
          onclick: async (e) => {
            e.preventDefault()
            vnode.state.loading = !vnode.state.loading
            if (session.user) {

              let model = document.querySelector('.model-input > input').value === '' ?
                'm' :
                document.querySelector('.model-input > input').value
              let color = document.querySelector('.color-input > input').value === '' ?
                'c' :
                document.querySelector('.color-input > input').value

              //
              SearchForm.clearFields()


              await m.request({
                  method: "GET",
                  url: `/api/avb/${model}/${color}`
                })
                .then(res => {
                  resultsArray = Object.values(res)
                })

              vnode.state.loading = !vnode.state.loading;

            } else {
              document.querySelector('.nav .user-icon').click()
            }
          }
        })
      ])
    ])
  }
}
m.mount(document.querySelector('.search-form'), SearchForm)

m.mount(document.querySelector('.results'), {
  loading: false,
  view: (vnode) => {
    if (resultsArray) {
      return m('.res-wrap', resultsArray.map((item, i) => {
        return m('.sku-wrapper-key', {
          key: item.id
        }, m(Sku, {
          sku: item,
          i: i
        }))
      }))

    }
  }
})


function Sku() {
  return {
    oninit: (vnode) => {
      vnode.state.loading = false
      vnode.state.imgSrc = ''
      vnode.state.availability = []
      vnode.state.price = undefined
      // vnode.state.sku = vnode.attrs.sku
      vnode.state.getPrice = () => {
        m.request({
            method: 'GET',
            url: `/api/price/${vnode.attrs.sku.year}/${vnode.attrs.sku.season}/${vnode.attrs.sku.model}`
          })
          .then(res => {
            vnode.state.price = res
          })
      }

    },
    oncreate: (vnode) => {
      // vnode.state.imgSrc = ''
    },
    view: (vnode) => {
      let i = vnode.attrs.i
      let sku = vnode.attrs.sku
      let string = sku.string.split(' ').join('')
      sku.price = ''
      let content = m(`img.sku-image-${i}[src=${vnode.state.imgSrc}]`)
      return m(Card, {
          class: `sku-wrapper`,
          interactive: true,
          elevated: 2,
          fluid: true
        }, m(`.sku`, m(`.sku-title.flex.row`, {
            style: 'margin:10px'
          },
          // here will go skuString , svgButton and skuPrice
          m('.string', sku.string),
          m(Popover, {
            class: 'sku-picture',
            hasArrow: true,
            hasBackdrop: false,
            position: 'top',
            interactionType: 'click',
            hasBackdrop: false,
            content,
            trigger: m(Button, {
              class: 'get-image',
              iconLeft: Icons.IMAGE,
              basic: true,
              size: 'xl',
              loading: vnode.state.loading,
              onclick: (e) => {
                vnode.state.imgSrc = ''
                vnode.state.loading = !vnode.state.loading;
                // e.preventDefault();
                // e.stopPropagation();
                fetch(`api/image/${sku.year}/${sku.season}/${sku.model}`)
                  .then(res => res.text())
                  .then(url => {
                    vnode.state.imgSrc = url;
                    vnode.state.loading = !vnode.state.loading;
                    m.redraw()
                  })
              }
            })
          }),
          // m(PriceLabel, {
          //   sku: sku,
          //   price: vnode.state.price
          // })
          m(Tag, {
            class: 'price-' + string,
            oninit: () => {
              if (!vnode.state.price) {
                m.request({
                  method: "GET",
                  url: `/api/price/${sku.year}/${sku.season}/${sku.model}`
                }).then(res => {
                  vnode.state.price = res
                })
              }
            },
            label: vnode.state.price
          })
        )),
        m('.row[style="display: block;"]', [
          // here go sku.desc and sizes
          m(Tag, {
            label: sku.descr
          }),
          // Size Buttons
          sku.sizes.map((item, i) => {
            return m(SizeButton, {
              sku: sku,
              i: i,
            })
          }), m('.sizes-wrapper', {}, sku.sizes.map((item, i) => {
            let string = sku.string.split(' ').join('')
            return m(`ul.size-wrapper.size-${i}-${string}`)
          }))

        ]))
    }
  }
}

function SizeButton() {

  let shops = []
  let isOpen = false
  let isLoading = false

  function getShops(sku, i) {
    m.request({
        method: 'GET',
        url: `/api/${sku.year}/${sku.season}/${sku.model}/${sku.color}/${sku.sizesForRequests[i]}`
      })
      .then(res => {
        shops = Object.values(res)[0]
        isLoading = !isLoading
        // m.redraw()

        // console.log(shops);
      })
  }

  return {
    // oninit(vnode) {
    //   vnode.state.loading = false
    // },
    view(vnode) {
      let i = vnode.attrs.i
      let sku = vnode.attrs.sku
      let size = vnode.attrs.sku.sizes[i]
      let sizeForReq = vnode.attrs.sku.sizesForRequests[i]

      return [m(Button, {
        label: size,
        style: 'margin: 0 2px;',
        loading: isLoading,
        size: 'xs',
        requestSize: sizeForReq,
        onclick: async (e) => {
          isLoading = !isLoading
          await getShops(sku, i)
          let string = sku.string.split(' ').join('')
          m.mount(document.querySelector(`ul.size-${i}-${string}`), {
            oninit: (vnode) => {
              vnode.state.intent = 'warning'
              vnode.state.label = 'Add'
            },
            view: () => {
              let string = sku.string.split(' ').join('')

              return [
                m(Tag, {
                  label: Object.keys(shops)[0],
                  intent: 'positive'
                }),
                m(Button, {
                  iconLeft: Icons.PLUS,
                  size: 'xs',
                  intent: vnode.state.intent,
                  label: vnode.state.label,
                  basic: true,
                  outline: true,
                  onclick: () => {

                    // ADD SEARCH


                    let price = document.querySelector('.price-' + string).textContent.split(',')[0].split('.').join('')

                    console.log(price);

                    m.request({
                      method: "GET",
                      url: `/api/addSearch/${session.user}/${sku.year}/${sku.season}/${sku.model}/${sku.color}/${size}/${sizeForReq}/${price}`
                    }).then(res => {
                      if (res._id) {
                        console.log(res._id);
                        vnode.state.intent = 'positive'
                        vnode.state.label = 'Added!'
                      } else {
                        vnode.state.label = 'Error!'
                        vnode.state.intent = 'negative'
                      }
                    })
                  }
                }),
                Object.values(shops)[0] ? Object.values(shops)[0].map(item => {
                  if (item.search('NEGOZIO SOLOMEO') != -1) {
                    return m('.list-item.solomeo', item)
                  } else {
                    return m(`.list-item`, item)
                  }
                }) : null
              ]
            }
          })

        }
      })]
    }
  }
}
// getShops
let displayShops = async () => {
  skuElement = document.querySelector(`.sku-${i}`)
  if (!skuElement.classList.contains('fetched')) {
    classy(skuElement, 'fetched', 'add');
    // array for promises
    let shopsPromises = [];

    for (var y = 0; y < sku.sizesForRequests.length; y++) {
      let shopsObject = fetch(`/api/${sku.year}/${sku.season}/${sku.model}/${sku.color}/${sku.sizesForRequests[y]}`).then(res => res.json());
      shopsPromises.push(await shopsObject);
    }

    let res = [];

    await Promise.all(shopsPromises).then(shops => {
      res = shops;
      return res
    });
  }
}

// document.querySelector(`.sizes-wrapper-${i}`).addEventListener('click', async (event) => {
//    FETCH SHOPS if not already fetched
//   if (!skuElement.classList.contains('fetched')) {
//     classy(skuElement, 'fetched', 'add');
//      array for promises
//     let shopsPromises = [];
//
//     for (var y = 0; y < sku.sizesForRequests.length; y++) {
//       let shopsObject = fetch(`/api/${sku.year}/${sku.season}/${sku.model}/${sku.color}/${sku.sizesForRequests[y]}`).then(res => res.json());
//       shopsPromises.push(await shopsObject);
//     }
//
//     let res = [];
//
//     await Promise.all(shopsPromises).then(shops => {
//       res = shops;
//     });
//
//      print out the shops
//
//     res.forEach((item, z) => {
//       let index = Object.keys(item)[0];
//
//       let size = Object.keys(item[index])
//       console.log(sku);
//
//       let sizeLabelElement = make('li', `size-${z}`, sizesWrapper)
//       let sizeRow = maker("div", {
//         class: "size size-row flex"
//       }, sizeLabelElement)
//       let sizeLabel = maker("label", {
//         class: "label label-size",
//         size: sku.sizesForRequests[z],
//          click to add to orders
//         on: [
//           "click", async () => {
//             if (toAddPopup.classList.contains('add')) {
//               toAddPopup.classList.remove('add')
//             } else
//               toAddPopup.classList.add('add');
//             }
//           ],
//         text: size
//       }, sizeRow);
//
//       let toAddPopup = maker("span", {
//         class: "label to-add-popout",
//         text: "Add to orders",
//         on: [
//           "click", () => {
//             let price = priceElement.textContent.slice(1);
//             fetch(`/api/addSearch/${session.user}/${sku.year}/${sku.season}/${sku.model}/${sku.color}/${size}/${sku.sizesForRequests[z]}/price`).then(res => res.json()).then(json => console.log(json))
//             toAddPopup.classList.remove('add')
//
//           }
//         ]
//       }, sizeRow);
//
//       let sizeList = make('ul', 'size=list', sizeLabelElement)
//
//       let shops = Object.values(item[index])[0]
//       shops.forEach(item => {
//         let shop = make('li', 'shop', sizeList)
//         if (item == 'NEGOZIO SOLOMEO') {
//           shop.classList.add('negsol')
//         }
//         shop.textContent = item
//       });
//
//     });
//     dotLoader.classList.add('hidden')
//      sizeswrapper set maxHeight for the first time
//     sizesWrapper.style.maxHeight = sizesWrapper.scrollHeight + 'px';
//   }
// });
//


//
// let getReceivables = async () => {
//   let url = `/api/request/${sku.year}/${sku.season}/${sku.model}/${sku.color}`;
//   let res = await fetch(url).then(r => r.json());
//   if (res.total != "") {
//     let total = make("div", "label label-receivables", labelsWrapper)
//     total.textContent = res.total + ' da ricevere: ';
//     total.setAttribute('model', sku.model);
//     total.setAttribute('color', sku.color);
//
//     let receivableSizes = Object.keys(res.receivables);
//     let receivableQty = Object.values(res.receivables);
//     console.log(`${sku.year}/${sku.season}/${sku.model} ${receivableSizes.length} `);
//     receivableSizes.forEach((item, j) => {
//       total.innerHTML += `<div class="label label-size">${receivableQty[j]}/${item} </div>`
//        console.log(total.innerHTML);
//     });
//
//   }
// };
// getReceivables();

//   sku.sizes.forEach(item => {
//     let sizeElement = make('div', 'label label-size', labelsWrapper);
//     sizeElement.textContent = item
//   });
// });

// document.querySelectorAll('.total-receivables').forEach((item) => {
//   item.addEventListener('click', async (event) => {
//     let model = event.target.getAttribute('model')
//     let color = event.target.getAttribute('color')
//     let rnd = event.target.getAttribute('rnd')
//     let receivables = await fetch(`api/toReceive/${model}/${color}/${rnd}`).then(res => res.json());
//     console.log(receivables);
//     if (receivables) {
//       item.textContent = ''
//       Object.keys(receivables).forEach(s => {
//         let size = s;
//         let qty = Object.values(receivables[s])
//         item.textContent += `${qty}/${size} `
//       });
//     }
//   }, true);
// });

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

function s(query, cb) {
  let e = document.querySelectorAll(query);
  e.length = 1 ?
    cb(e) :
    e.forEach(item => {
      cb(item)
    });
}