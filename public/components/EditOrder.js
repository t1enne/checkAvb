import m from 'mithril'
import {
    Tag,
    Icons,
    List,
    // ListItem,
    Button,
    // Popover,
    Select
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
import {
    NOSALE
} from '../noSaleAI20'


function AssignedSearch() {
    let imgSrc = ''
    return {
        view(vnode) {
            let item = vnode.attrs.search

            let content = m('.search-popover', [
                m(`img[src=${imgSrc}][style= padding: .5rem; border-radius:10px; display: block;]`, {
                    label: 'click',
                    oninit: () => {
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

            return m(`.cui-list-item.list-item-${vnode.attrs.index}`, [
                m(Button, {
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
                        }).then(() => {
                            let removedSearch = vnode.attrs.assignedSearches.splice(vnode.attrs.index, 1)[0]
                            Searches.unassignedSearches.push(removedSearch)
                            showToast(`Unassigned ${item.model}`, 'warning')
                        })
                    }
                }),
                m('.left-content[style=text-align:left;]',
                    m('.sku-detail.label', `${item.year}${item.season} ${item.model} ${item.color} ${item.size}`),
                    m(Tag, {
                        label: item.descr,
                    }),
                ),
                m('.right-content[style=overflow:hidden;]',
                    // m(Select, {
                    //   size: 'xs',
                    //   fluid: true,
                    //   options: ['NEG1', 'DOS', 'N/A', 'ECOMM', 'HQ']
                    // }),
                    m(Tag, {
                        label: `€${item.price}`,
                        intent: 'warning'
                    }),
                    // m(Select, {
                    //   size: 'xs',
                    //   basic: true,
                    //   style: 'margin-right:10px;',
                    //   options: ['N/A', 'NEG1', 'DOS', 'ECOMM', 'HQ']
                    // })
                )
            ])
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
            // let contentR = m('.right-content[style=overflow:hidden;]',
            //   m(Tag, {
            //     label: item.descr,
            //   }),
            //   m(Tag, {
            //     label: item.price,
            //     intent: 'warning'
            //   })
            // )
            // let contentLeft = m('.left-content.flex[style=flex-wrap:nowrap;align-items:center;]',
            //   m(Button, {
            //     iconLeft: Icons.PLUS_SQUARE,
            //     // intent: 'positive',
            //     compact: true,
            //     basic: true,
            //     size: 'xs',
            //     style: 'height: 100%',
            //     onclick: (e) => {
            //       // ASSIGN SEARCH
            //       e.preventDefault()
            //       let searchId = item._id
            //       vnode.state.assignOrder(order, searchId, index)
            //     }
            //   }), m('.sku-info', m('.sku-detail.label', `${item.year}${item.season} ${item.model} ${item.color} ${item.size}`)))
            // const trigger = m(ListItem, {
            //   // label: `${item.year}${item.season} ${item.model} ${item.color} ${item.size}`,
            //   contentRight: contentR,
            //   contentLeft: contentLeft
            // })
            // return m(Popover, {
            //   closeOnEscapeKey: true,
            //   closeOnContentClick: false,
            //   inline: true,
            //   hasArrow: true,
            //   position: 'top',
            //   trigger,
            //   content: m('.search-popover', m(Tag, {
            //     fluid: true,
            //     label: item.descr
            //   }))
            // })

            return m(`.cui-list-item.list-item-${vnode.attrs.index}`, [
                m(Button, {
                    iconLeft: Icons.PLUS_SQUARE,
                    // intent: 'positive',
                    compact: true,
                    basic: true,
                    size: 'xs',
                    style: 'height: 100%',
                    onclick: (e) => {
                        // ASSIGN SEARCH
                        e.preventDefault()
                        let searchId = item._id
                        vnode.state.assignOrder(order, searchId, index)
                    }
                }),
                m('.left-content[style=text-align:left;]',
                    m('.sku-detail.label', `${item.year}${item.season} ${item.model} ${item.color} ${item.size}`),
                    m(Tag, {
                        label: item.descr,
                    }),
                ),
                m('.right-content[style=overflow:hidden;]',
                    m(Tag, {
                        label: `€${item.price}`,
                        intent: 'warning'
                    })
                )
            ])


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
        vnode.state.confirmed = false
        vnode.state.confirmText = 'You sure?'
        vnode.state.confirmOutline = true

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
                            label: vnode.state.confirmed ? vnode.state.confirmText : 'Clear Items',
                            compact: true,
                            // basic: true,
                            outlined: vnode.state.confirmOutline,
                            intent: 'negative',
                            onclick(e) {
                                console.log(vnode)

                                vnode.state.confirmed = true

                                let del = () => {

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
                                m.redraw()
                            }
                        })
                    ])
                ),

                m('.searches.grid', [
                    m('.assigned-searches',
                        m('h3', 'Assigned Searches'),
                        m(List, {
                            size: 'xs',
                            interactive: false,
                            // style: `max-width: ${vnode.state.maxWidth};`
                        }, vnode.state.assignedSearches.length > 0 ? vnode.state.assignedSearches.map((search, i) => {
                            if (vnode.state.pieces < vnode.state.assignedSearches.length) {
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
                                label: `total: €${vnode.state.total}`
                            })
                        ])),
                    m('.unassigned-searches',
                        m('h3', 'Unassigned Searches'),
                        m(List, {
                            size: 'xs',
                            interactive: false,
                            style: `max-height: 65vh;`
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
