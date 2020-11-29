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
  List,
  ListItem,
  SelectList,
  QueryList,
  Switch,
  Card,
  Tag
} from 'construct-ui';

let seaching = false,
  session;

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
      }, m("h1#client-name", client.name + ' ' + client.surname), m(Button, {
        class: 'mail-copy-button',
        label: `mail: ${client.mail}`,
        iconLeft: Icons.COPY,
        basic: true,
        onclick: (e) => {
          navigator.clipboard.writeText(client.mail)
        }
      }))
    })
  }
}

let Searches = {
  searchesList: [],
  loadSearches: async () => {
    m.request({
      method: "GET",
      url: `/api/SearchInstances`
    }).then(res => {
      Searches.searchesList = res
      Orders.unassignedSearches = res.filter(item => item.order === 'unassigned').map(item => {
        return item
      })
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
        outlined: true,
        onclick: (e) => {
          e.preventDefault()
          e.stopPropagation()
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
        intent: 'primary'
      })
      let contentL = m(Button, {
        iconLeft: Icons.PLUS,
        intent: 'positive',
        size: 'xs',
        outlined: true,
        onclick: (e) => {
          let searchId = item._id
          let orderId = document.querySelector('.selected-order').getAttribute('id')

          Searches.searchesList.push(order)

          console.log('search id is ' + searchId);
          console.log('order id is ' + orderId);
          // Add to order and update AssignedOrders
          m.request({
            method: 'GET',
            url: `/api/addToClient/${orderId}/${searchId}`
          }).then(res => {
            console.log(res);
          })
        }
      })
      return m(ListItem, {
        label: `${item.year}${item.season} ${item.model} ${item.color} ${item.size}`,
        contentRight: contentR,
        contentLeft: contentL
      })
    }
  }
}

// GET ORDERS
let Orders = {
  ordersList: [],
  unassignedSearches: [],
  loadOrders: () => {
    m.request({
      method: "GET",
      url: "/api/listOrders"
    }).then(res => {
      console.log(res);
      Orders.ordersList = res
    })
  },
  oninit: (vnode) => {
    if (Orders.ordersList.length === 0) {
      Orders.loadOrders()
      Searches.loadSearches()
    }
  },
  order: {
    oninit: (vnode) => {
      vnode.state.isOpen = true
      vnode.state.selected = false
      vnode.state.pieces = 0
      vnode.state.total = 0
    },
    onupdate: (vnode) => {
      vnode.state.pieces = 0
      vnode.state.total = 0
    },
    view: (vnode) => {
      let order = vnode.attrs.order
      let o = vnode.attrs.o
      return m(Card, {
          class: `order client-order`,
          id: order._id,
          clientId: order.clientId,
          interactive: true,
          fluid: true,
          elevation: 2,
          onclick: () => {
            // controller for the selected order
            vnode.state.selected = !vnode.state.selected
            let thisOrder = document.getElementById(`${order._id}`)

            if (vnode.state.selected) {
              classy('.client-order', 'selected-order', 'remove')
              thisOrder.classList.toggle('selected-order')
              classy('.client-order', 'd-none', 'add')
              thisOrder.classList.toggle('d-none')
            } else {
              // thisOrder.classList.toggle('selected-order')
              classy('.client-order', 'selected-order', 'remove')
              classy('.client-order', 'd-none', 'remove')

            }
          }
          // SELECT ORDER
        }, m(Button, {
          iconLeft: Icons.X,
          style: 'float:right;',
          intent: 'negative',
          basic: true,
          align: 'center',
          onclick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('deleting order ' + order._id);
            m.request({
              method: "DELETE",
              url: `/api/deleteOrder/${order._id}`
            }).then(res => console.log)
          }
        }), [
          m(`h1.order-client-name#client-name[id=${order.clientId}]`, order.clientName),
          m(Tag, {
            label: order.date,
            class: 'date'
          }),
          m(Tag, {
            label: order.user,
            intent: 'primary',
            class: 'user'
          }),
          m(Tag, {
            label: order._id,
            class: 'url',
            size: 'xs',
            url: order._id
          })
        ],
        m(`.searches-order-id-${order._id}.flex.reverse.searches-order-id`),
        [m(Collapse, {
            duration: 200,
            isOpen: vnode.state.isOpen
          }, [m('h3', m(List,
              Searches.searchesList.filter(search => search.order === order._id).map(search => {
                vnode.state.pieces++
                vnode.state.total += parseInt(search.price)
                return m(AssignedSearch, {
                  search: search
                })
              })),
            m('.row.searches-totals',
              m(Tag, {
                label: `total pcs: ${vnode.state.pieces}`
              }),
              m(Tag, {
                label: `total: €${vnode.state.total}`,
                intent: 'primary'
              })))]),
          m(Button, {
            fluid: true,
            size: 'md',
            style: 'margin: auto; display: block; padding: 0; transition: rotate .3s',
            iconLeft: Icons.CHEVRON_DOWN,
            basic: true,
            onclick: (e) => {
              e.preventDefault()
              e.stopPropagation()
              vnode.state.isOpen = !vnode.state.isOpen
              let svg = e.target.children[0]
            }
          })
        ])
    }
  },
  view: (vnode) => {

    return [m('.orders.flex.reverse', Orders.ordersList.map((order, o) => {
        return m(Orders.order, {
          order: order,
          o: o
        })
      })),
      m('h1', 'Unassigned Searches'),
      m(Card, {
        fluid: true
      }, m(List, {
        class: 'unassigned-searches',
        interactive: true
      }, Orders.unassignedSearches.map(item => {
        return m(UnassignedSearch, {
          item: item
        })
      })))
    ]
  }
}

let Tabs = {
  oninit: async () => {
    session = await fetch('/logged').then(res => res.json())
  },
  ordersSection: {
    view: (vnode) => {
      return [
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
              m.mount(vnode.dom, Orders)
            }
          }, 'Order List')
        ]),
        // m(UnassignedSearches)

        // m(Card, {
        //   fluid: true
        // }, m(`.unassigned-searches`, m('h1', 'Unassigned Searches'),
        //   Searches.searchesList.map(item => {
        //     console.log(item);
        //     return m('.text', item.model)
        //     // show ADD button only on the orders tab
        //
        //   })))
      ]
    }
  },
  clientsSection: {
    loading: false,
    view: (vnode) => {
      return [
        m("h1", "Client List"),
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
                type: 'text',
                name: 'client-mail',
                placeholder: 'email'
              }),
              m(Button, {
                type: 'submit',
                label: "Add Client",
                // REGISTER NEW CLIENT
                onclick: async () => {
                  let name = document.querySelector('input[name="client-name"]').value
                  let surname = document.querySelector('input[name="client-surname"]').value
                  let mail = document.querySelector('input[name="client-mail"]').value

                  let username = mail.split('@')[0]
                  let provider = mail.split('@')[1].split('.')[0]
                  let tail = mail.split('@')[1].split('.')[1]
                  // await fetch(`/api/newClient/${name}/${surname}/${username}/${provider}/${tail}`).then(res => res.json).then(json => console.log(json))
                  await m.request({
                    method: "GET",
                    url: `/api/newClient/${name}/${surname}/${username}/${provider}/${tail}`
                  })
                  // emit a click event for convenience on the clients radio to fetch the clients
                  document.querySelector('#radio2').click()

                }
              })
            ])
          ]),
          m("ul.client-list", m(Clients))
        ])
      ]
    }
  },
  historySection: {
    historyList: [],
    view: () => {
      return [
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
        m(Searches)
      ]
    }
  },
  view: () => {
    return [
      m('.user-icons.flex.f-width', {
        style: 'justify-content:space-between;position:absolute;'
      }, m(Icon, {
        name: Icons.USER,
        size: 'xl',
        onclick: () => {
          classy('.user-panel', 'hidden', 'toggle')
        }
      }), m('.login-user'), m(Icon, {
        name: Icons.X,
        size: 'xl',
        onclick: () => {
          classy('.user-panel', 'hidden', 'toggle')
        }
      })),
      m("input[id='radio1'][type='radio'][name='css-tabs']", {
        onclick: () => {
          m.mount(document.querySelector('#content1'), Tabs.ordersSection)
        }
      }),
      m("input[id='radio2'][type='radio'][name='css-tabs']", {
        onclick: (e) => {
          m.mount(document.querySelector('#content2'), Tabs.clientsSection)
        }
      }),
      m("input[id='radio3'][type='radio'][name='css-tabs']", {
        onclick: (e) => {
          m.mount(document.querySelector('#content3'), Tabs.historySection)
        }
      }),
      m("[id='tabs']", [
        m("label.tab-orders[id='tab1 tab-orders'][for='radio1']", "Orders"),
        m("label.tab-clients[id='tab2 tab-clients'][for='radio2']", "Clients"),
        m("label.tab-history[id='tab3 tab-history'][for='radio3']", "History")
      ]),
      m("[id='content']", [
        m("section[id='content1']"), m("section[id='content2']"), m("section[id='content3']")
        // m(Tabs.ordersSection),
        // m(Tabs.clientsSection),
        // m(Tabs.historySection)
      ])
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

module.exports = Tabs