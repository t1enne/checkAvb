import 'regenerator-runtime/runtime';
import m from 'mithril';

import {
  Button,
  Drawer,
  DrawerPosition,
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
  Menu,
  MenuItem,
  Size,
  Toaster,
  Popover,
  PopoverInteraction,
  PopoverPosition,
  Switch
} from 'construct-ui';

import '../node_modules/construct-ui/lib/index.css'

FocusManager.alwaysShowFocus();

// import ordersSection from '/components/Tabs';
// import clientsSection from '/components/Tabs';
// import historySection from '/components/Tabs';
const {
  ordersSection,
  clientsSection,
  historySection
} = require('/components/Tabs')

import {
  Nav,
  showToast
} from '/components/Nav';

import EditOrder from '/components/EditOrder';



let session;


let Login = {
  remember: false,
  oninit: (vnode) => {
    if (localStorage.pwd) {
      vnode.state.remember = true

    }

  },
  view: (vnode) => {
    return [
      m('form.login', m('.logo-bg', {
          style: 'width: auto; height: 100px; background: url("/logo.86ce68ea.svg") no-repeat center;'
        }),
        m(Input, {
          style: 'display:block;margin:5px auto;',
          value: localStorage.user || '',
          contentLeft: m(Icon, {
            name: Icons.USER
          }),
          placeholder: 'Your ASWEB Username',
          autocomplete: 'username'
        }),
        m(Input, {
          style: 'display:block;margin:5px auto;',
          value: localStorage.pwd || '',
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
          onclick: (e) => {
            console.log('clicked');
            e.preventDefault();
            login.authenticate(vnode.state.remember)
            showToast(`Welcome back ${localStorage.user} !`, 'positive')
          }
        }),
        m(Switch, {
          label: 'Remember me',
          style: 'display: block;margin: auto;margin-top: 1rem;',
          checked: vnode.state.remember,
          onchange: () => {
            vnode.state.remember = !vnode.state.remember
          }
        })
      )
    ]
  }
}



// Router

m.route(document.body, '/main', {
  '/main': {
    onmatch: () => {
      if (!session) {
        login.check()
      } else return Home
    }
  },
  '/login': Login,
  '/orders': ordersSection,
  '/clients': clientsSection,
  '/history': historySection,
  '/orders/edit/:id': EditOrder
})


//check if session exists
let login = {
  async check() {
    session = await fetch('/logged').then(res => res.json())
    session.user ? m.route.set('/main') : m.route.set('/login')
  },
  async authenticate(remember) {
    let user = document.querySelector('form.login > div.cui-input:nth-child(2) > input:nth-child(2)').value.trim()
    let pwd = document.querySelector('form.login div.cui-input:nth-child(3) > input:nth-child(2)').value.trim()

    m.request({
      url: `/api/login`,
      headers: {
        'user': user,
        'pwd': pwd
      }
    }).then(res => {
      if (res.user) {
        session = res
        localStorage.smurf = session.smurf
        localStorage.user = session.user
        if (remember) localStorage.pwd = pwd
      }
      login.check()
    })
  }
}




let Home = {
  results: [],
  size: 'xl',
  view: (vnode) => {
    return m('.main', m(Nav), m('.search', m('h1', 'Disponibilita'), m('.search-form', m(SearchForm))),
      m('.results', Home.results.map((item, i) => {
        return m('.sku-wrapper-key', {
          key: item.id
        }, m(Sku, {
          sku: item,
          i: i
        }))
      })))
  }
}


// m.mount(document.querySelector('.results'), {
//   loading: false,
//   view: (vnode) => {
//     if (resultsArray) {
//       return m('.res-wrap', resultsArray.map((item, i) => {
//         return m('.sku-wrapper-key', {
//           key: item.id
//         }, m(Sku, {
//           sku: item,
//           i: i
//         }))
//       }))
//     }
//   }
// })

// userIcons

// m.mount(document.querySelector('.user-panel-dropdown'), {
//   view: () => {
//     return [m('.user-icons', {
//       onclick: () => {
//         classy('.user-panel', 'hidden', 'toggle')
//         document.querySelector('#radio1').click()
//       }
//     }, m(Icon, {
//       name: Icons.CHEVRON_DOWN,
//       size: 'xl'
//     }), m(Icon, {
//       name: Icons.USER,
//       size: 'xl'
//     }), m('.login-user'))]
//
//   }
// })

// m.mount(document.querySelector('.user-personal-bucket'), Tabs)

let resultsArray;

let SearchForm = {
  loading: false,
  clearResults: () => Home.results = [],
  view: (vnode) => {
    return m("form", [
      m("div.model",
        //m("input.model-input.twelve.columns[placeholder='Model'][type='text']")
        m(Input, {
          class: 'model-input',
          style: 'width:75%;max-width:300px;',
          placeholder: 'Model'
        })),
      m("div.color",
        // m("input.color-input.twelve.columns[placeholder='Color'][type='text']")
        m(Input, {
          class: 'color-input',
          style: 'width:75%;max-width:300px;',
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
            SearchForm.clearResults()
            vnode.state.loading = !vnode.state.loading

            let model = document.querySelector('.model-input > input').value === '' ?
              'm' :
              document.querySelector('.model-input > input').value
            let color = document.querySelector('.color-input > input').value === '' ?
              'c' :
              document.querySelector('.color-input > input').value

            //

            await m.request({
                method: "GET",
                url: `/api/avb/${model}/${color}`
              })
              .then(res => {
                Home.results = Object.values(res)
                console.log(Home.results);
              })

            vnode.state.loading = !vnode.state.loading;
          }
        })
      ])
    ])
  }
}

// m.mount(document.querySelector('.search-form'), SearchForm)




function Sku() {
  return {
    oninit: (vnode) => {
      vnode.state.loading = false
      vnode.state.imgSrc = ''
      vnode.state.availability = []
      vnode.state.imgFetched = false
      // vnode.state.price = '--,--'
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

                if (!vnode.state.imgFetched) {
                  vnode.state.loading = !vnode.state.loading;
                  // e.preventDefault();
                  // e.stopPropagation();
                  fetch(`api/image/${sku.year}/${sku.season}/${sku.model}`)
                    .then(res => res.text())
                    .then(url => {
                      vnode.state.imgFetched = true
                      vnode.state.imgSrc = url;
                      vnode.state.loading = !vnode.state.loading;
                      m.redraw()
                    })
                }
              }
            })
          }),
          // m(PriceLabel, {
          //   sku: sku,
          //   price: vnode.state.price
          // })
          m(Tag, {
            class: 'price-' + string,
            intent: 'warning',
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
            label: sku.descr,
            intent: 'warning',
            size: 'xs'
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
      })
  }

  return {
    view(vnode) {
      let i = vnode.attrs.i
      let sku = vnode.attrs.sku
      let size = vnode.attrs.sku.sizes[i]
      let sizeForReq = vnode.attrs.sku.sizesForRequests[i]

      return [m(Button, {
        label: size,
        style: 'margin: 0 2px;',
        loading: isLoading,
        intent: 'positive',
        size: 'xs',
        requestSize: sizeForReq,
        onclick: async (e) => {
          isLoading = !isLoading
          await getShops(sku, i)
          let string = sku.string.split(' ').join('')
          m.mount(document.querySelector(`ul.size-${i}-${string}`), {
            oninit: (vnode) => {
              vnode.state.intent = 'warning'
            },
            view: () => {
              let string = sku.string.split(' ').join('')


              if (Object.keys(shops)[0]) {
                return [
                  m(Tag, {
                    label: Object.keys(shops)[0],
                    intent: 'positive'
                  }),
                  m(Button, {
                    iconLeft: Icons.PLUS,
                    size: 'xs',
                    basic: true,
                    outline: true,
                    onclick: () => {
                      // ADD SEARCH
                      let price = document.querySelector('.price-' + string).textContent.split(',')[0].split('.').join('')

                      m.request({
                        method: "GET",
                        url: `/api/addSearch/${session.user}/${sku.year}/${sku.season}/${sku.model}/${sku.color}/${size}/${sizeForReq}/${price}`
                      }).then(res => {
                        if (res._id) {
                          console.log(res._id);
                          showToast(`Added Search ${sku.string} ${size}!`, 'positive')
                        } else {
                          showToast(`Couldn't add Search ${sku.string} ${size}!`, 'negative')
                        }
                      })
                    }
                  }),
                  Object.values(shops)[0].map(item => {
                    if (item.search('NEGOZIO SOLOMEO') != -1) {
                      return m('.list-item.solomeo', item)
                    } else {
                      return m(`.list-item`, item)
                    }
                  })
                ]
              }
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