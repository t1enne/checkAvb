import m from 'mithril';

let Tabs = {
  view: () => {
    return [
      m("input[id='radio1'][type='radio'][name='css-tabs']"),
      m("input[id='radio2'][type='radio'][name='css-tabs']", {
        onclick: async () => {

          let clientsList = await m.request({method: "GET", url: `/api/listClients`});

          let clientsArray = clientsList.map(client => {
            return m(`li.client-list-item[url=${client._id}]`, m("h1#client-name", client.name + ' ' + client.surname), m('span', 'mail: ' + client.mail), m("span", client.orders))
          })
          console.log(clientsArray);
          console.log(clientsList);

          m.mount(document.querySelector('.client-list'), {
            view: () => {
              return clientsArray;
            }
          })
        }
      }),
      m("input[id='radio3'][type='radio'][name='css-tabs']"),
      m("[id='tabs']", [
        m("label.tab-orders[id='tab1 tab-orders'][for='radio1']", "Orders"),
        m("label.tab-clients[id='tab2 tab-clients'][for='radio2']", "Clients"),
        m("label.tab-history[id='tab3 tab-history'][for='radio3']", "History")
      ]),
      m(
      "[id='content']",
      // ORDERS HANDLER
      [
        m(
        "section.container[id='content1']", [
          m("h3", "Your Orders"),
          m(".orders-container", [
            m(".create-order", [
              m("button.button", {
                onclick: () => {
                  m.mount(document.querySelector('.new-order'), {
                    view: () => {
                      return m('.order-div', [
                        m("h1#client-name", 'TEST'),
                        m("input.search-client-name"),
                        m(".order-items-list"),
                        m(".date")
                      ])
                    }
                  })
                }
              },
              "New Order")])
            , m('.new-order')
            ])]),
        // CLIENT HANDLER
        m("section.container[id='content2']", [
          m("h3", "Client List"),
          m("div.client-content", [
            m("div.new-client.row", [
              m("button.button", {
                onclick: (e) => {
                  document.querySelector('.new-client.row').classList.toggle('reveal-inputs')
                }
              }, "New Client"),
              m("div.new-client-inputs.row", [
                m("input[type='text'][name='client-name'][value=''][placeholder='Name']", {style: `text-transform: capitalize`}),
                m("input[type='text'][name='client-surname'][value=''][placeholder='Surname']", {style: `text-transform: capitalize`}),
                m("input[type='text'][name='client-mail'][value=''][placeholder='Email']", {style: `text-transform: lowercase`}),
                m("button.button[type='submit']", {
                  onclick: async () => {
                    let name = document.querySelector('input[name="client-name"]').value
                    let surname = document.querySelector('input[name="client-surname"]').value
                    let mail = document.querySelector('input[name="client-mail"]').value

                    let username = mail.split('@')[0]
                    let provider = mail.split('@')[1].split('.')[0]
                    let tail = mail.split('@')[1].split('.')[1]
                    // await fetch(`/api/newClient/${name}/${surname}/${username}/${provider}/${tail}`).then(res => res.json).then(json => console.log(json))
                    await m.request({method: "GET", url: `/api/newClient/${name}/${surname}/${username}/${provider}/${tail}`})
                    // emit a click event for convenience on the clients radio to fetch the clients
                    document.querySelector('#radio2').click()

                  }
                }, "Add Client")
              ])
            ]),
            m("ul.client-list",)
          ])
        ]), m("section.container[id='content3']", [
          m("h3", "A History of your Searches"),
          m("div.searches-content")
        ])
      ])
    ]
  }
}

module.exports = Tabs
