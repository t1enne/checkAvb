import m from 'mithril'
import {
  Card,
  Button,
  Icons,
  // Icon,
  List,
  ListItem,
  PopoverMenu,
  Tag
} from 'construct-ui'
// import { Tabs } from './Tabs'
import {
  Searches
} from './Searches'
import {
  showToast
} from './Nav'

function AssignedSearch() {
  return {
    view(vnode) {
      let item = vnode.attrs.search
      let contentR = m(Button, {
        iconLeft: Icons.MINUS,
        intent: 'negative',
        size: 'xs',
        class: 'remove-search',
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
            showToast(`Unassigned ${item.model}`, 'warning')
          })
        }
      })

      return m(ListItem, {
        label: `${item.year}${item.season} ${item.model} ${item.color} ${item.size}`,
        class: `list-item-${vnode.attrs.index}`,
        contentLeft: contentR,
        contentRight: [
          m(Tag, {
            size: 'xs',
            label: item.descr
          }),
          m(Tag, {
          intent: 'warning',
          size: 'xs',
          label: `€${item.price}`
        })]
      })
    }
  }
}

let Orders = {
  ordersList: [],
  loadOrders: () => {
    m.request({
      method: "GET",
      url: "/api/listOrders"
    }).then(res => {
      Orders.ordersList = res
    })
  },
  oninit: () => {
    console.log(Orders);
    if (Orders.ordersList.length === 0) {
      Orders.loadOrders()
      Searches.loadSearches()
    }
  },
  order: {
    oninit: (vnode) => {
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
      // let o = vnode.attrs.o
      return m(Card, {
        class: `order client-order`,
        id: order._id,
        clientId: order.clientId,
        interactive: true,
        fluid: true,
        elevation: 2
        // SELECT ORDER
      }, m(PopoverMenu, {
        closeOnContentClick: true,
        content: [
          m(Button, {
            iconLeft: Icons.EDIT,
            label: 'Edit',
            basic: true,
            align: 'center',
            onclick: () => {
              m.route.set(`/orders/edit/${order.id}`)
            }
          }),
          m(Button, {
            iconLeft: Icons.TRASH,
            intent: 'negative',
            label: 'Delete',
            basic: true,
            align: 'center',
            onclick: (e) => {
              // DELETE ORDER
              e.preventDefault();
              e.stopPropagation();
              console.log('deleting order ' + order._id);
              m.request({
                method: "DELETE",
                url: `/api/deleteOrder/${order._id}`
              }).then(res => {
                console.log(res)
                Orders.ordersList.splice(Orders.ordersList.indexOf(res), 1)
                m.redraw()
              })
            }
          })
        ],
        trigger: m(Button, {
          iconLeft: Icons.SETTINGS,
          style: 'float:right;'
        })
      }), [
        m(`.order-client-name[id=${order.clientId}]`, m(`h1`, order.clientName)),
        m(Tag, {
          label: order.date,
          class: 'date'
        })
        // m(Tag, {
        //   label: order.user,
        //   intent: 'primary',
        //   class: 'user'
        // })
        //, m(Tag, {
        //   label: order._id,
        //   class: 'url',
        //   size: 'xs',
        //   url: order._id
        // })
      ], [
        m(
          List, {
            size: 'xs',
            style: `margin-top:1rem;`,
            class: 'collapsible assigned-searches'
          }, Searches.assignedSearches[order._id] && vnode.state.pieces === 0 ?
          (Searches.assignedSearches[order._id].map((search, i) => {
            if (vnode.state.pieces < document.querySelectorAll('.assigned-searches .cui-list-item').length) {
              document.querySelectorAll('.assigned-searches .cui-list-item')
              vnode.state.pieces++
              vnode.state.total += parseInt(search.price)
            }
            return m(AssignedSearch, {
              search: search,
              index: i
            })
          })) :
          undefined),
        m('.row.totals', m(Tag, {
          label: `total pcs: ${vnode.state.pieces}`
        }), m(Tag, {
          label: `total: €${vnode.state.total}`,
          intent: 'warning'
        })),
        m(Button, {
          fluid: true,
          class: 'expand-icon',
          size: 'md',
          style: 'margin: auto; display: block; padding: 0; transition: rotate .3s',
          iconLeft: Icons.CHEVRON_UP,
          basic: true,
          onclick: (e) => {
            e.preventDefault()
            e.stopPropagation()
            let expandIcon = vnode.dom.querySelector('.expand-icon')
            let list = vnode.dom.querySelector('.assigned-searches')
            list.classList.toggle('collapsed')
            expandIcon.classList.toggle('reversed')
            // let svg = e.target.children[0]
            m.redraw()
          }
        })
      ])
    }
  },
  view: () => {
    // UNASSIGNED SEARCHES MOVED TO EDIT ORDER

    return [
      m('.orders.flex.reverse', Orders.ordersList.map((order, o) => {
        return m(Orders.order, {
          order: order,
          o: o
        })
      }))
      // m('h1', 'Unassigned Searches'),
      // m(Card, {
      //   fluid: true
      // }, m(List, {
      //   class: 'unassigned-searches',
      //   interactive: false,
      //   size: 'xs'
      // }, m('.list-items-wrapper',
      //   array
      // )))
    ]
  }
}

exports.Orders = Orders
// exports.AssignedSearch = AssignedSearch
