import m from 'mithril'
import {
  Card,
  Tag,
  Input,
  Icon,
  Icons,
  Button,
  Popover
} from 'construct-ui'
import {
  Nav,
  showToast
} from './Nav'
import {
  Clients
} from './Clients'
import {
  Orders
} from './Orders'

let Inputs = {
  // name: '',
  // surname: '',
  // mail: '',
  // phone: '',
  size: 'lg',
  oninit(vnode) {
    vnode.state.name = vnode.attrs.client.name
    vnode.state.surname = vnode.attrs.client.surname
    vnode.state.mail = vnode.attrs.client.mail
    vnode.state.phone = vnode.attrs.client.phone
  },
  view(vnode) {
    return m('.inputs',
      m('.input-wrapper',
        m(Input, {
          contentLeft: m(Icon, {
            name: Icons.USER
          }),
          value: vnode.state.name,
          placeholder: 'Client name',
          oninput: (e) => {
            vnode.state.name = e.srcElement.value
          },
          size: vnode.state.size
        })),
      m('.input-wrapper',
        m(Input, {
          value: vnode.state.surname,
          oninput: (e) => {
            vnode.state.surname = e.srcElement.value
          },
          placeholder: 'Client surname',
          contentLeft: m(Icon, {
            name: Icons.USER
          }),
          size: vnode.state.size
        })), m('.input-wrapper',
        m(Input, {
          placeholder: 'Mail',
          class: 'mail-input',
          type: 'email',
          value: vnode.state.mail,
          oninput: (e) => {
            vnode.state.mail = e.srcElement.value
          },
          contentLeft: m(Icon, {
            name: Icons.MAIL
          }),
          size: vnode.state.size
        })), m('.input-wrapper',
        m(Input, {
          placeholder: 'Telephone number',
          type: 'tel',
          value: vnode.state.phone,
          oninput: (e) => {
            vnode.state.phone = e.srcElement.value
          },
          contentLeft: m(Icon, {
            name: Icons.PHONE
          }),
          size: vnode.state.size
        })),
      m('.buttons]',
        m(Button, {
          label: 'Discard Changes',
          iconLeft: Icons.TRASH,
          onclick() {
            m.route.set('/clients')
          }
        }),
        m(Button, {
          label: 'Save Changes',
          iconLeft: Icons.SAVE,
          intent: 'primary',
          interactive: true,
          onclick() {
            m.request({
              method: 'POST',
              url: '/api/updateClient',
              headers: {
                id: vnode.attrs.client.id,
                name: vnode.state.name,
                surname: vnode.state.surname,
                mail: vnode.state.mail,
                phone: vnode.state.phone
              }
            }).then(res => showToast(`Updated client ${res.name}!`, 'positive'))
          }
        })
      )
    )
  }
}

let EditClient = {
  // client: {},
  loadClient(vnode) {
    return m.request({
      method: 'GET',
      url: `/api/client/${vnode.attrs.id}`
    }).then(res => vnode.state.client = res[0])
  },
  async oninit(vnode) {

    let client = Clients.clientsList.length > 0 ? Clients.clientsList.filter(item => item.id == vnode.attrs.id)[0] : null
    console.log(client);

    vnode.state.client = client || await vnode.state.loadClient(vnode)
  },
  view(vnode) {
    if (vnode.state.client) {
      return [
        m(Nav),
        m('.client-edit-wrapper',
          m(Card, {
              fluid: true,
            },
            m('.title',
              m('h1#client-name', vnode.state.client.fullname),
              m(Tag, {
                size: 'xs',
                label: vnode.attrs.id
              })
            ),
            m('.edit-inputs',
              m(Inputs, {
                client: vnode.state.client
              })
            )
          )
        )
      ]
    }
  }
}

module.exports = EditClient