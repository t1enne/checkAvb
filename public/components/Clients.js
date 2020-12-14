import m from 'mithril'
import {
  Button,
  ControlGroup,
  Icon,
  Input,
  Dialog,
  Icons,
  PopoverMenu,
  Card
} from 'construct-ui'
import {
  showToast
} from './Nav'

let Clients = {
  clientsList: [],
  dialogOpen: false,
  loadClients: () => {
    m.request({
      method: "GET",
      url: `/api/listClients`
    }).then(res => Clients.clientsList = res)
  },
  close(vnode) {
    vnode.state.dialogOpen = false
  },
  oninit: () => {
    if (Clients.clientsList.length === 0) {
      Clients.loadClients()
    }
  },
  view: (vnode) => {
    return Clients.clientsList.map((client, i) => {
      return [
        m(Card, {
            class: 'client-card',
            url: client._id,
            elevated: 2,
            interactive: true,
            fluid: true
          }, m(Button, {
            iconLeft: Icons.EDIT,
            label: 'Edit',
            style: 'float: right',
            basic: true,
            align: 'center',
            onclick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              m.route.set(`/clients/edit/${client._id}`)
            }
          }),
          m("h1#client-name", client.name + ' ' + client.surname), m(Button, {
            class: 'mail-copy-button',
            label: `mail: ${client.mail}`,
            iconLeft: Icons.COPY,
            basic: true,
            onclick: (e) => {
              e.preventDefault()
              navigator.clipboard.writeText(client.mail)
            }
          }), m(Button, {
            class: 'phone-copy-button',
            label: `phone: ${client.phone}`,
            iconLeft: Icons.COPY,
            basic: true,
            onclick: (e) => {
              e.preventDefault()
              navigator.clipboard.writeText(client.phone)
            }
          }))
      ]
    })
  }
}

exports.Clients = Clients