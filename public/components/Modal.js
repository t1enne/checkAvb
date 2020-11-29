import m from 'mithril';

let Modal = {
  orders: [],
  oncreate: () => {
    return m.request({method: "GET", url: `/api/listOrders`})
    .then(res => Modal.ordersList = res );
  },
  view: () => {
    return m('.modal.flex.justify', m('.modal-sm', [m("input.search-client-name#client-name[type='text'][placeholder='Search Order or Client']", {
        onkeyup: (vnode) => {
          let query = vnode.target.value.toLowerCase()
          let results = Modal.orders.filter(client => client.fullname.toLowerCase().search(query) != -1)
          let mArray = Modal.orders.map(order => {
            console.log(order);
            // return [
            //   m(`input.search-result[type='radio'][style='display: none;'][url=${result._id}][value=${result.fullname}]`),
            //   m('#client-name.u-full-width', {
            //     style:'padding:1rem;cursor:pointer;',
            //     onclick: async (vnode) => {
            //       document.querySelector('.search-results').style.display = 'none';
            //       document.querySelector('input.search-client-name').value = '';
            //     }
            //   }, [
            //     m('span#client-name', result.fullname),
            //     m('span')
            //   ])
            // ]
          })
        }
      }
      )]))
  }
}
module.exports = Modal
