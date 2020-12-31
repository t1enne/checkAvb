import 'regenerator-runtime/runtime';
import m from 'mithril';
import io from 'socket.io-client'

const socket = io('http://localhost:3000', {
  withCredentials: true
})


socket.on('connect', () => {})

socket.on('message-client-connected', (msg) => {
  console.log(msg);
})

import {
  Button,
  Input,
  Icon,
  Icons,
  FocusManager,
  // Form,
  // FormGroup,
  // FormLabel,
  Card,
  Tag,
  // Menu,
  // MenuItem,
  // Size,
  Popover,
  Switch
} from 'construct-ui';

import '../node_modules/construct-ui/lib/index.css'

import logo from './logo.svg'
import {
  login
} from '/components/login'

FocusManager.alwaysShowFocus();

const {
  ordersSection,
  clientsSection,
  historySection
} = require('/components/Tabs')

import {
  Nav,
  showToast
} from '/components/Nav';

import {
  Dhl
} from '/components/Dhl'

import EditClient from '/components/EditClient'

import {
  Searches
} from '/components/Searches'

import {
  Richieste
} from '/components/Richieste'

import EditOrder from '/components/EditOrder';

import {
  NOSALE
} from './noSaleAI20';

let Login = {
  remember: false,
  user: localStorage.user,
  pwd: localStorage.pwd,
  oninit: (vnode) => {
    if (localStorage.pwd) {
      vnode.state.remember = true
    }
    // login.check()
  },
  view: (vnode) => {
    return [m('form.login', m('.logo-bg', {
      style: `width: auto; height: 100px; background: url(${logo}) no-repeat center;`
    }), m(Input, {
      style: 'display:block;margin:5px auto;',
      value: vnode.state.user,
      contentLeft: m(Icon, {
        name: Icons.USER
      }),
      placeholder: 'Your ASWEB Username',
      autocomplete: 'username',
      oncreate: (e) => {
        console.log(e, localStorage);
        e.dom.value = localStorage.user
      },
      oninput: (e) => {
        vnode.state.user = e.srcElement.value
      }
    }), m(Input, {
      style: 'display:block;margin:5px auto;',
      value: vnode.state.pwd,
      contentLeft: m(Icon, {
        name: Icons.LOCK
      }),
      placeholder: 'Password',
      type: 'password',
      autocomplete: "current-password",
      oncreate: (e) => {
        // console.log(e);
      },
      oninput: (e) => {
        vnode.state.pwd = e.srcElement.value
      }
    }), m(Button, {
      label: 'LOGIN',
      style: 'display:block;margin:5px auto;',
      type: 'submit',
      intent: 'primary',
      onclick: async (e) => {
        console.log('clicked');
        e.preventDefault();

        await login.authenticate(vnode.state.remember, vnode.state.user, vnode.state.pwd)
      }
    }), m(Switch, {
      label: 'Remember me',
      style: 'display: block;margin: auto;margin-top: 1rem;',
      checked: vnode.state.remember,
      onchange: () => {
        vnode.state.remember = !vnode.state.remember
      }
    }))]
  }
}

let Home = {
  results: [],
  size: 'xl',
  view: () => {
    return m('.main', m(Nav), m('.search', m('h1', 'Disponibilità'), m('.search-form', m(SearchForm))), m('.results', Home.results.map((item, i) => {
      return m('.sku-wrapper-key', {
        key: item.id
      }, m(Sku, {
        sku: item,
        i: i
      }))
    })))
  }
}

let SearchForm = {
  loading: false,
  clearResults: () => Home.results = [],
  // oninit: login.check,
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
            }).then(res => {
              console.log(res);
              if (res === 404) {
                showToast(`Cant connect to websmart!`, 'negative')
              } else if (res === 401) {
                showToast('Search Again!')
                // localStorage.clear()
                m.route.set('/login')
              } else {
                Home.results = Object.values(res)
                if (Home.results.length === 0) {
                  showToast('No results found!', 'negative')
                }
              }
            })

            vnode.state.loading = !vnode.state.loading;
          }
        })
      ])
    ])
  }
}

function Sku() {
  return {
    oninit: (vnode) => {
      vnode.state.loading = false
      vnode.state.imgSrc = ''
      vnode.state.availability = []
      vnode.state.imgFetched = false
      vnode.state.discountedPrice = ''
      // vnode.state.sku = vnode.attrs.sku
      vnode.state.getPrice = () => {
        m.request({
          method: 'GET',
          url: `/api/price/${vnode.attrs.sku.year}/${vnode.attrs.sku.season}/${vnode.attrs.sku.model}`
        }).then(res => {
          vnode.state.price = res
        })
      }
    },
    oncreate: () => {
      // vnode.state.imgSrc = ''
    },
    view: (vnode) => {
      let i = vnode.attrs.i
      let sku = vnode.attrs.sku
      let string = sku.string.split(' ').join('')
      sku.price = ''
      let discountedPrice = null
      let content = m(`img.sku-image-${i}[src=${vnode.state.imgSrc}]`)
      return m(Card, {
          class: `sku-wrapper`,
          interactive: true,
          elevated: 2,
          fluid: true
        }, m(`.sku`, m(`.sku-title.flex.row`,
          // here will go skuString , svgButton and skuPrice
          m('.string', sku.string),
          m('.basic'),
          m(Popover, {
            class: 'sku-picture',
            hasArrow: true,
            hasBackdrop: false,
            position: 'top',
            interactionType: 'click',
            content,
            trigger: m(Button, {
              class: 'get-image',
              iconLeft: Icons.IMAGE,
              basic: true,
              size: 'xl',
              compact: true,
              loading: vnode.state.loading,
              onclick: () => {
                if (!vnode.state.imgFetched) {
                  vnode.state.loading = !vnode.state.loading;
                  // e.preventDefault();
                  // e.stopPropagation();
                  fetch(`api/image/${sku.year}/${sku.season}/${sku.model}`).then(res => res.text()).then(url => {
                    vnode.state.imgFetched = true
                    vnode.state.imgSrc = url;
                    vnode.state.loading = !vnode.state.loading;
                    m.redraw()
                  })
                }
              }
            })
          }))),
        m('.row.labels-rows.flex.space-b', [
          // here go sku.desc and sizes
          m(Button, {
            label: sku.descr,
            intent: 'warning',
            size: 'xs'
          }),
          m(Button, {
            class: 'price-' + string,
            size: 'xs',
            intent: vnode.state.salable ?
              'negative' : 'warning',
            oncreate: () => {
              if (!vnode.state.price) {
                vnode.state.price = 'fetching'
                m.request({
                  method: "GET",
                  url: `/api/price/${sku.year}/${sku.season}/${sku.model}`
                }).then(res => {
                  if (NOSALE.filter(e => e == sku.model + sku.color).length > 0 && sku.year + sku.season === '202') {
                    vnode.dom.querySelector('.basic').textContent = 'BASICO'
                    vnode.state.price = res
                  } else if (sku.year + sku.season === '202') {
                    vnode.state.salable = true
                    vnode.state.price = res
                  } else {
                    vnode.state.price = res
                  }
                })
              }
            },
            sublabel: `€${vnode.state.price}`,
            label: vnode.state.discountedPrice,
            onclick() {
              if (vnode.state.salable) {
                vnode.state.discountedPrice = parseInt(parseInt(vnode.state.price) * 0.7)
                let sub = vnode.dom.querySelector('.cui-button-sublabel')
                sub.style.textDecoration = 'line-through'
              }
            }
          })
        ]),
        // Size Buttons
        m('.sizes-buttons',
          sku.sizes.map((item, i) => {
            return m(SizeButton, {
              sku: sku,
              i: i
            })
          })),
        m('.sizes-wrapper', {}, sku.sizes.map((item, i) => {
          let string = sku.string.split(' ').join('')
          return m(`ul.size-wrapper.size-${i}-${string}`)
        }))

      )
    }
  }
}

function SizeButton() {

  let shops = []
  // let isOpen = false
  let isLoading = false

  function getShops(sku, i) {
    m.request({
      method: 'GET',
      url: `/api/${sku.year}/${sku.season}/${sku.model}/${sku.color}/${sku.sizesForRequests[i]}`
    }).then(res => {
      shops = Object.values(res)[0]
      isLoading = !isLoading
    })
  }

  return {
    view(vnode) {
      let i = vnode.attrs.i
      let sku = vnode.attrs.sku
      let {
        year,
        season,
        model,
        color,
        descr
      } = sku
      let size = vnode.attrs.sku.sizes[i]
      let sizeForReq = vnode.attrs.sku.sizesForRequests[i]

      return [m(Button, {
        label: size,
        style: 'margin: 0 2px;',
        loading: isLoading,
        intent: 'positive',
        size: 'xs',
        requestSize: sizeForReq,
        onclick: async () => {
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
                      let price = document.querySelector('.price-' + string).textContent.split('€')[1].split(',')[0].split('.').join('')
                      console.log(price);

                      m.request({
                        method: "GET",
                        url: `/api/addSearch`,
                        headers: {
                          year,
                          season,
                          model,
                          price,
                          color,
                          descr,
                          size,
                          sizeForReq
                        }
                      }).then(res => {
                        if (res._id) {
                          console.log(res._id);
                          showToast(`Added Search ${sku.string} ${size}!`, 'positive')
                          Searches.searchesList.splice(0, 0, res)
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



// Router

m.route(document.body, '/main', {
  '/main': {
    onmatch: () => {
      if (!localStorage.smurf) {
        login.check()
      } else
        return Home
    }
  },
  '/login': Login,
  '/orders': ordersSection,
  '/clients': clientsSection,
  '/history': historySection,
  '/dhlTracking': Dhl,
  '/orders/edit/:id': EditOrder,
  '/clients/edit/:id': EditClient,
  '/richieste': Richieste,
})