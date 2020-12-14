import m from 'mithril'
import { Card, Icon, Icons, Input, Button, List, ListItem, Tag } from 'construct-ui'

import {Nav} from './Nav'

function getDhl(awb) {
  m.request({
    method: 'GET',
    url: `/api/tracking/${awb}`
  }).then(res => {
    console.log(res[0]);
    return res[0]
  })
}

function Results() {
  return {
    view(vnode){
      let res = vnode.attrs.res
      let delivered = res.delivery.status === 'delivered' ? 'positive' : 'warning'

      return [m(Tag, {label: 'destination: ' + res.destination.value || null}),
      m(Tag, {label: res.delivery.status || null, intent: delivered}),
      m(Tag, {label: 'pieces: ' + res.pieces.value || null}),
      m(Tag, {label: 'updated: ' + res.checkpoints[0].date}),
      m(List, {
        fluid:true,
        interactive:true
      }, res.checkpoints.map(item => {
          return m(ListItem, {label: item.description})
        })
      )]
    }
  }
}

let Dhl = {
  tracking: '',
  view: (vnode) => {
    return [ m(Nav), m('.container',
      m(Card, {
        fluid: true,
      },
        m(Input, {
          oninput: (e) => {
            e.preventDefault()
            // console.log(e);
            vnode.state.tracking = e.srcElement.value
          },
          contentLeft: m(Icon, {
            name: Icons.BOX
          }),
          placeholder: 'dhl tracking'
        }),
        m(Button, {
          label: 'Search',
          iconLeft: Icons.SEARCH,
          onclick: async (e) => {
            e.preventDefault()
            let awb = vnode.state.tracking.split(' ').join('')
            m.request({
              method: 'GET',
              url: `/api/tracking/${awb}`
            }).then(res => {
              vnode.state.results = res[0]
              m.render(document.querySelector('.dhl-results'), m(Results, {res: vnode.state.results}))
            })
            // vnode.state.results = await getDhl(vnode.state.tracking)
            // console.log(vnode.state);
          }
        }),
        m('.dhl-results')
      ))
    ]
  }
}

exports.Dhl = Dhl
