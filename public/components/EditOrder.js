import m from 'mithril'
import {
  Tag,
  Icons,
  List,
  ListItem,
  Button,
  Popover
} from 'construct-ui'
import {
  Nav,
  showToast
} from './Nav'
import {
  Searches
} from './Searches'
import {
  Orders
} from './Orders'


function AssignedSearch() {
  let imgSrc = ''
  return {
    view(vnode) {
      let item = vnode.attrs.search

      let content = m('.search-popover', [
        m(Tag, {
          label: item.descr
        }),
        m(`img[src=${imgSrc}][style= padding: .5rem; border-radius:10px]`, {
          label: 'click',
          oninit: (e) => {
            fetch(`api/image/${item.year}/${item.season}/${item.model}`, {
                headers: {
                  smurf: localStorage.smurf
                }
              })
              .then(res => res.text())
              .then(url => {
                imgSrc = url;
                m.redraw()
              })
          }
        })
      ]);

      let contentR = m(Button, {
        iconLeft: Icons.MINUS_SQUARE,
        // intent: 'negative',
        basic: true,
        compact: true,
        size: 'xs',
        class: 'remove-search',
        onclick: (e) => {
          //UNASSIGN SEARCH
          e.preventDefault()
          e.stopPropagation()
          m.request({
            method: 'GET',
            url: `/api/addToClient/unassigned/${item._id}`
          }).then(res => {
            let removedSearch = vnode.attrs.assignedSearches.splice(vnode.attrs.index, 1)[0]
            Searches.unassignedSearches.push(removedSearch)
            showToast(`Unassigned ${item.model}`, 'warning')
          })
        }
      })

      return m(Popover, {
        closeOnEscapeKey: true,
        closeOnContentClick: false,
        inline: true,
        hasArrow: true,
        position: 'auto',
        trigger: m(ListItem, {
          label: `${item.year}${item.season} ${item.model} ${item.color} ${item.size}`,
          class: `list-item-${vnode.attrs.index}`,
          contentLeft: contentR,
          contentRight: m(Tag, {
            intent: 'warning',
            size: 'xs',
            label: item.price
          })
        }),
        content
      })

    }
  }
}

function UnassignedSearch() {
  return {
    assignOrder(order, searchId, index) {
      m.request({
        method: 'GET',
        url: `/api/addToClient/${order.id}/${searchId}`
      }).then(res => {
        console.log(res);
        let removedSearch = Searches.unassignedSearches.splice(index, 1)[0]
        showToast(`Assigned ${res.model}!`, 'positive')
        Searches.assignedSearches[order.id].push(removedSearch)
      })

    },
    view: (vnode) => {
      let item = vnode.attrs.item
      let order = vnode.attrs.order
      let index = vnode.attrs.index
      let contentR = m(Tag, {
        label: item.price,
        intent: 'warning'
      })

      const trigger = m(ListItem, {
        label: `${item.year}${item.season} ${item.model} ${item.color} ${item.size}`,
        contentRight: contentR,
        contentLeft: m(Button, {
          iconLeft: Icons.PLUS_SQUARE,
          // intent: 'positive',
          compact: true,
          basic: true,
          size: 'xs',
          onclick: (e) => {
            // ASSIGN SEARCH
            e.preventDefault()
            let searchId = item._id
            vnode.state.assignOrder(order, searchId, index)
          }
        })
      })
      return m(Popover, {
        closeOnEscapeKey: true,
        closeOnContentClick: false,
        inline: true,
        hasArrow: true,
        position: 'auto',
        trigger,
        content: m('.search-popover', m(Tag, {
          label: item.descr
        }))
      })


    }
  }
}

let EditOrder = {
  order: {},
  maxWidth: 'none',
  assignedSearches: [],
  total: 0,
  pieces: 0,
  loadAssignedSearches(id) {
    return m.request({
      url: `/api/${id}/SearchInstances`
    }).then(res => res)
  },
  loadUnassignedSearches() {
    return m.request({
      method: 'GET',
      url: '/api/SearchInstances/unassigned'
    }).then(res => res)
  },
  loadOrder(id) {
    return m.request({
      method: 'GET',
      url: `/api/order/${id}`
    }).then(res => res)
  },
  oninit: async (vnode) => {

    let order = Orders.ordersList.length > 0 ? Orders.ordersList.filter(item => item.id == vnode.attrs.id)[0] : null
    Searches.searchesList.length > 0 ? null : Searches.loadSearches()

    vnode.state.order = order || await vnode.state.loadOrder(vnode.attrs.id)
    vnode.state.assignedSearches = Searches.assignedSearches[vnode.attrs.id] ? Searches.assignedSearches[vnode.attrs.id] : Searches.assignedSearches[vnode.attrs.id] = []

  },
  view: (vnode) => {
    let order = vnode.state.order

    return [
      m(Nav),
      m('.edit-order-wrapper.container', [
        m('.title#client-name',
          m('h2', `${vnode.state.order.clientName}'s Order`),
          m('.flex.space-b.labels', [
            m(Tag, {
              label: vnode.state.order._id,
              size: 'xs'
            }),
            m(Button, {
              iconLeft: Icons.TRASH,
              label: 'Clear Items',
              compact: true,
              // basic: true,
              outlined: true,
              intent: 'negative',
              onclick() {
                m.request({
                  method: 'DELETE',
                  url: '/api/deleteAssignedSearches/',
                  headers: {
                    order: vnode.state.order._id
                  }
                }).then(res => {
                  showToast(`Deleted ${res} items!`, 'none')
                  Searches.loadSearches()
                })
              }
            })
          ])
        ),

        m('.searches.flex', [
          m('.assigned-searches',
            m('h3', 'Assigned Searches'),
            m(List, {
              size: 'sm',
              interactive: false,
              style: `max-width: ${vnode.state.maxWidth};`
            }, vnode.state.assignedSearches.length > 0 ? vnode.state.assignedSearches.map((search, i) => {
              if (vnode.state.pieces < document.querySelectorAll('.assigned-searches .cui-list-item').length) {
                vnode.state.pieces += 1
                vnode.state.total += parseInt(search.price)
              }
              return m(AssignedSearch, {
                search: search,
                index: i,
                key: i,
                assignedSearches: vnode.state.assignedSearches
              })
            }) : null),
            m('.row.totals', [
              m(Tag, {
                label: `pcs: ${vnode.state.pieces}`
              }),
              m(Tag, {
                intent: 'primary',
                label: `total: ${vnode.state.total}`
              })
            ])),
          m('.unassigned-searches',
            m('h3', 'Unassigned Searches'),
            m(List, {
              size: 'sm',
              interactive: false,
              style: `max-height: 65vh; max-width: ${vnode.state.maxWidth};`
            }, Searches.unassignedSearches.map((item, i) => {
              return m(UnassignedSearch, {
                item: item,
                order: order,
                index: i,
                unassignedSearches: vnode.state.unassignedSearches,
              })
            })))
        ])
      ])
    ]
  }
}


module.exports = EditOrder