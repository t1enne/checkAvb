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

import {
  Nav,
  showToast
} from './Nav'
import {
  Orders
} from './Orders'

import {
  Clients
} from './Clients'

import {
  Searches
} from './Searches'


let seaching = false,
  session;

const AppToaster = new Toaster()

// let Orders = {
//   ordersList: [],
//   loadOrders: () => {
//     m.request({
//       method: "GET",
//       url: "/api/listOrders"
//     }).then(res => {
//       console.log(res);
//       Orders.ordersList = res
//       return res
//     })
//   },
//   oninit: (vnode) => {
//     if (Orders.ordersList.length === 0) {
//       Orders.loadOrders()
//       Searches.loadSearches()
//     }
//   },
//   order: {
//     oninit: (vnode) => {
//       vnode.state.selected = false
//       vnode.state.pieces = 0
//       vnode.state.total = 0
//     },
//     onupdate: (vnode) => {
//       vnode.state.pieces = 0
//       vnode.state.total = 0
//     },
//     view: (vnode) => {
//       let order = vnode.attrs.order
//       let o = vnode.attrs.o
//       return m(Card, {
//           class: `order client-order collapsible`,
//           id: order._id,
//           clientId: order.clientId,
//           interactive: true,
//           fluid: true,
//           elevation: 2
//           // SELECT ORDER
//         }, m(PopoverMenu, {
//           closeOnContentClick: true,
//           content: [
//             m(Button, {
//               iconLeft: Icons.TRASH,
//               intent: 'negative',
//               label: 'Delete',
//               basic: true,
//               align: 'center',
//               onclick: (e) => {
//                 // DELETE ORDER
//                 e.preventDefault();
//                 e.stopPropagation();
//                 console.log('deleting order ' + order._id);
//                 m.request({
//                   method: "DELETE",
//                   url: `/api/deleteOrder/${order._id}`
//                 }).then(res => {
//                   console.log(res)
//                   Orders.ordersList.splice(Orders.ordersList.indexOf(res), 1)
//                 })
//               }
//             })
//           ],
//           trigger: m(Button, {
//             iconLeft: Icons.SETTINGS,
//             style: 'float:right;',
//           })
//         }),
//         [m(`.order-client-name[id=${order.clientId}]`, {
//             onclick: () => {
//               m.route.set(`/orders/edit/${order.id}`)
//             }
//           }, m(`h1`, order.clientName)),
//           m(Tag, {
//             label: order.date,
//             class: 'date'
//           }),
//           m(Tag, {
//             label: order.user,
//             intent: 'primary',
//             class: 'user'
//           })
//           //, m(Tag, {
//           //   label: order._id,
//           //   class: 'url',
//           //   size: 'xs',
//           //   url: order._id
//           // })
//         ],
//         [
//           m(List, {
//               size: 'xs',
//               style: `margin-top:1rem;`,
//               class: 'collapsible assigned-orders'
//             },
//
//             Searches.assignedSearches[order._id] ? (
//               Searches.assignedSearches[order._id].map(search => {
//                 vnode.state.pieces++
//                 vnode.state.total += parseInt(search.price)
//                 return m(AssignedSearch, {
//                   search: search
//                 })
//               })
//             ) : undefined
//           ), m('.row.searches-totals',
//             m(Tag, {
//               label: `total pcs: ${vnode.state.pieces}`
//             }),
//             m(Tag, {
//               label: `total: €${vnode.state.total}`,
//               intent: 'warning'
//             })), m(Button, {
//             fluid: true,
//             size: 'md',
//             style: 'margin: auto; display: block; padding: 0; transition: rotate .3s',
//             iconLeft: Icons.CHEVRON_DOWN,
//             basic: true,
//             onclick: (e) => {
//               e.preventDefault()
//               e.stopPropagation()
//               let list = vnode.dom.querySelector('.assigned-orders')
//               list.classList.toggle('collapsed')
//               console.log(vnode);
//               let svg = e.target.children[0]
//               m.redraw()
//             }
//           })
//         ])
//     }
//   },
//   view: (vnode) => {
//     // let array
//     // if (Searches.unassignedSearches.length != 0) {
//     //   array = Searches.unassignedSearches.map(item => {
//     //     return m(UnassignedSearch, {
//     //       item: item,
//     //     })
//     //   })
//     // }
//
//     return [m('.orders.flex.reverse', Orders.ordersList.map((order, o) => {
//       return m(Orders.order, {
//         order: order,
//         o: o
//       })
//     }))]
//     // ,
//     // m('h1', 'Unassigned Searches'),
//     // m(Card, {
//     //   fluid: true
//     // }, m(List, {
//     //   class: 'unassigned-searches',
//     //   interactive: false,
//     //   size: 'xs'
//     // }, m('.list-items-wrapper',
//     //   array
//     // )))
//
//   }
// }


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
                          url: `/api/createOrder/${item._id}/${item.name}&${item.surname}`,
                          headers: {
                            user: localStorage.user
                          }
                        }).then(res => {
                          console.log(res);
                          Orders.ordersList.push(res)
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
          // m(".order-list", m(Orders))
          m(".order-list", m(Orders))
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
            console.log(Clients.clientsList);
            vnode.state.loading = !vnode.state.loading
          }
        }),
        m(".client-content", [
          m(".new-client.row", [
            m(Button, {
              onclick: () => {
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
                contentLeft: m(Icon, {
                  name: Icons.USER
                }),
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
                style: 'display:block;',
                label: "Add Client",
                // CREATE NEW CLIENT
                onclick: async () => {
                  let name = document.querySelector('input[name="client-name"]').value.trim()
                  let surname = document.querySelector('input[name="client-surname"]').value.trim()
                  let mail = document.querySelector('input[name="client-mail"]').value.trim()
                  let phone = document.querySelector('input[name="client-phone"]').value.trim()
                  await m.request({
                    method: "GET",
                    url: `/api/newClient`,
                    headers: {
                      name,
                      surname,
                      mail,
                      phone
                    }
                  }).then(client => {
                    Clients.clientsList.push(client)
                    document.querySelector('.new-client.row').classList.toggle('reveal-inputs')
                    showToast(`Added ${client.fullname}!`, 'primary')
                  })
                }
              })
            ])
          ]),
          m(Clients)
        ])
      )
    ]
  }
}

let historySection = {
  historyList: [],
  view: () => {
    return [m(Nav),
      m('.container.history',
        m("h1", "A History of your Searches"),
        m(Button, {
          basic: true,
          iconLeft: Icons.TRASH,
          compact: true,
          label: 'Clear Unassigned Searches',
          onclick() {
            m.request({
              method: 'DELETE',
              url: '/api/deleteSearches'
            }).then(res => showToast(`Deleted ${res} Searches!`, 'negative'))
          }
        }),
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