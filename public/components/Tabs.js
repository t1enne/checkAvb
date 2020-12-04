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
  Classes,
  Collapse,
  ControlGroup,
  PopoverMenu,
  List,
  ListItem,
  SelectList,
  Toaster,
  QueryList,
  Switch,
  Card,
  Tag
} from 'construct-ui';

import Nav from './Nav'
let Orders = require('./Orders')
console.log(Orders);

let seaching = false,
  session;

const AppToaster = new Toaster()

let Clients = {
  clientsList: [],
  loadClients: () => {
    m.request({
      method: "GET",
      url: `/api/listClients`
    }).then(res => Clients.clientsList = res)
  },
  oninit: () => {
    if (Clients.clientsList.length === 0) {
      Clients.loadClients()
    }
  },
  view: () => {
    return Clients.clientsList.map(client => {
      return m(Card, {
          class: 'client-card',
          url: client._id,
          elevated: 2,
          interactive: true,
          fluid: true
        },
        m("h1#client-name", client.name + ' ' + client.surname),
        m(Button, {
          class: 'mail-copy-button',
          label: `mail: ${client.mail}`,
          iconLeft: Icons.COPY,
          basic: true,
          onclick: (e) => {
            navigator.clipboard.writeText(client.mail)
          }
        }),
        m(Button, {
          class: 'phone-copy-button',
          label: `phone: ${client.phone ? client.phone : ''} `,
          iconLeft: Icons.COPY,
          basic: true,
          onclick: (e) => {
            navigator.clipboard.writeText(client.phone)
          }
        })
      )
    })
  }
}
let Searches = {
  searchesList: [],
  unassignedSearches: [],
  assignedSearches: {},
  loadSearches: async () => {
    m.request({
      method: "GET",
      url: `/api/SearchInstances`
    }).then(res => {
      console.log(res);
      Searches.searchesList = res
      Searches.filterSearches(res)
      console.log(Searches.assignedSearches);
    })
  },
  filterSearches: (searches) => {
    console.log('filtering searches');
    Searches.unassignedSearches = searches.filter(item => item.order === 'unassigned')
    searches.map(search => {
      if (search.order != 'unassigned') {
        if (!Searches.assignedSearches[search.order]) {
          Searches.assignedSearches[search.order] = []
          Searches.assignedSearches[search.order].push(search)
        } else {
          Searches.assignedSearches[search.order].push(search)
        }
      }
    })


  },
  oninit: () => {
    if (Searches.searchesList.length === 0) {
      Searches.loadSearches()
    }
  },

  view: () => {
    return m(List, {
      interactive: true,
      size: 'md',
      class: 'flex reverse',
      style: 'max-height:none;'
    }, Searches.searchesList.map(item => {
      return m(ListItem, {
        label: `${item.year}${item.season} ${item.model} ${item.color} ${item.size}`,
        contentRight: m(Tag, {
          label: '€' + item.price + ',00',
          intent: 'warning'
        })
      })
    }))
  }
}

function AssignedSearch() {

  return {
    view(vnode) {
      let item = vnode.attrs.search
      let contentR = m(Button, {
        iconLeft: Icons.MINUS,
        intent: 'negative',
        size: 'xs',
        basic: true,
        onclick: (e) => {
          //UNASSIGN SEARCH
          e.preventDefault()
          e.stopPropagation()
          console.log(1);
          m.request({
            method: 'GET',
            url: `/api/addToClient/unassigned/${item._id}`
          }).then(res => {
            console.log(res);
          })
        }
      })

      return m(ListItem, {
        label: `${item.year}${item.season} ${item.model} ${item.color} ${item.size}`,
        // label: 'text',
        contentLeft: contentR,
        contentRight: m(Tag, {
          intent: 'warning',
          size: 'xs',
          label: item.price
        })
      })
    }
  }
}

function UnassignedSearch() {

  return {
    view: (vnode) => {
      let item = vnode.attrs.item
      let contentR = m(Tag, {
        label: item.price,
        intent: 'warning'
      })
      // let contentL =
      return m(ListItem, {
        label: `${item.year}${item.season} ${item.model} ${item.color} ${item.size}`,
        contentRight: contentR,
        contentLeft: m(Button, {
          iconLeft: Icons.PLUS,
          intent: 'positive',
          size: 'xs',
          label: 'Add',
          basic: true,
          onclick: (e) => {
            // ASSIGN SEARCH
            let searchId = item._id
            let orderId = document.querySelector('.selected-order').getAttribute('id')

            console.log('search id is ' + searchId);
            console.log('order id is ' + orderId);

            m.request({
              method: 'GET',
              url: `/api/addToClient/${orderId}/${searchId}`
            }).then(res => {
              console.log(res);

            })



          }
        })
      })
    }
  }
}

let ordersSection = {
  view: (vnode) => {
    return [
      m(Nav),
      m('.container.orders',
        m("h1", "Your Orders"),
        m(Button, {
          basic: true,
          iconLeft: Icons.REFRESH_CW,
          style: 'float: right;',
          // loading: vnode.tag.loading,
          onclick: async () => {
            // vnode.tag.loading = !vnode.tag.loading
            await Orders.loadOrders()
            // vnode.tag.loading = !vnode.tag.loading
          }
        }),
        m(".orders-container", [
          m(".create-order", [m(Button, {
            label: 'New Order',
            iconLeft: Icons.PLUS,
            //CREATE NEW ORDER
            onclick: () => {
              m.mount(document.querySelector('.new-order'), {
                oninit: () => {
                  if (Clients.clientsList.length === 0) {
                    Clients.loadClients()
                  }
                },
                view: () => {
                  return m('.order-div', [
                    // CREATE ORDER

                    m(SelectList, {
                      items: Clients.clientsList,
                      itemRender: (item) => m(ListItem, {
                        label: item.fullname,
                        url: item._id,
                        name: item.name,
                        surname: item.surname,
                        contentLeft: m('div', '+')
                      }),
                      itemPredicate: (query, item) => item.fullname.toLowerCase().includes(query.toLowerCase()),
                      onSelect: (item) => {
                        console.log(item)
                        m.request({
                          method: "POST",
                          url: `/api/createOrder/${item._id}/${session.user}/${item.name}&${item.surname}`
                        }).then(res => {
                          console.log(res);
                          Orders.ordersList.push(res)
                          m.mount(document.querySelector('.order-list'), Orders)
                        })
                      },
                      trigger: m(Button, {
                        iconLeft: Icons.USERS,
                        label: "Search Client",
                        iconRight: Icons.CHEVRON_DOWN
                      })
                    })
                  ])
                }
              })
            }
          })]),
          m('.new-order'),
          m(".search-results"),
          m(".order-list", {
            oncreate: (vnode) => {
              // m.mount(vnode.dom, Orders)
            }
          }, 'Order List')
        ]))
    ]
  }
}

let clientsSection = {
  loading: false,
  view: (vnode) => {
    return [m(Nav),
      m('.container.clients', m("h1", "Client List"),
        m(Button, {
          basic: true,
          iconLeft: Icons.REFRESH_CW,
          style: 'float: right;',
          loading: vnode.state.loading,
          onclick: async () => {
            vnode.state.loading = !vnode.state.loading
            await Clients.loadClients()
            vnode.state.loading = !vnode.state.loading
          }
        }),
        m(".client-content", [
          m(".new-client.row", [
            m(Button, {
              onclick: (e) => {
                document.querySelector('.new-client.row').classList.toggle('reveal-inputs')
              },
              label: "New Client",
              iconLeft: Icons.PLUS
            }),
            m(ControlGroup, {
              class: 'new-client-inputs'
            }, [
              m(Input, {
                contentLeft: m(Icon, {
                  name: Icons.USER
                }),
                type: 'text',
                name: 'client-name',
                placeholder: 'Name'
              }),
              m(Input, {
                type: 'text',
                name: 'client-surname',
                placeholder: 'Surname'
              }),
              m(Input, {
                contentLeft: m(Icon, {
                  name: Icons.MAIL
                }),
                type: 'text',
                name: 'client-mail',
                placeholder: 'email'
              }),
              m(Input, {
                contentLeft: m(Icon, {
                  name: Icons.PHONE
                }),
                type: 'text',
                name: 'client-phone',
                placeholder: 'Telephone'
              }),
              m(Button, {
                type: 'submit',
                label: "Add Client",
                // CREATE NEW CLIENT
                onclick: async () => {
                  let name = document.querySelector('input[name="client-name"]').value.trim()
                  let surname = document.querySelector('input[name="client-surname"]').value.trim()
                  let mail = document.querySelector('input[name="client-mail"]').value.trim()
                  let phone = document.querySelector('input[name="client-phone"]').value.trim()

                  let username = mail.split('@')[0]
                  let provider = mail.split('@')[1].split('.')[0]
                  let tail = mail.split('@')[1].split('.')[1]

                  await m.request({
                    method: "GET",
                    url: `/api/newClient/${name}/${surname}/${username}/${provider}/${tail}/${phone}`
                  })
                  // emit a click event for convenience on the clients radio to fetch the clients
                  document.querySelector('#radio2').click()

                }
              })
            ])
          ]),
          m("ul.client-list", m(Clients))
        ])
      )
    ]
  }
}

let historySection = {
  historyList: [],
  view: () => {
    return [m(Nav),
      m('.container.searches',
        m("h1", "A History of your Searches"),
        m(Button, {
          basic: true,
          iconLeft: Icons.REFRESH_CW,
          style: 'float: right;',
          // loading: vnode.tag.loading,
          onclick: async () => {
            // vnode.tag.loading = !vnode.tag.loading
            await Searches.loadSearches()
            // vnode.tag.loading = !vnode.tag.loading
          }
        }),
        m(Searches))
    ]
  }
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

function s(query, cb) {
  let e = document.querySelectorAll(query);
  e.length = 1 ?
    cb(e) :
    e.forEach(item => {
      cb(item)
    });
}

exports.ordersSection = ordersSection
exports.clientsSection = clientsSection
exports.historySection = historySection
// module.exports = Searches