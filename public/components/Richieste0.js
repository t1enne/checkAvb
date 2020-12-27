import m from 'mithril'
import {
  Button,
  Icon,
  Icons,
  Input,
  Menu,
  MenuItem,
  Popover,
  Tag,
  SelectList,
  ListItem,
  Toaster
} from 'construct-ui'

import {
  Nav,
  showToast
} from './Nav'

const mockrequests = [

  {
    nr: '1',
    date: "23/12/20",
    season: "202",
    line: "2",
    model: "m2200162",
    color: "cw425",
    size: "50",
    user: "ntaov",
    client: "elena",
    feedback: "",
    order: ""
  },
  {
    nr: '2',
    date: "23/12/20",
    season: "202",
    line: "1",
    model: "m2300150",
    color: "cs170",
    size: "50",
    user: "mpetrosi",
    client: "natalia",
    feedback: "ok da Parigi, rientra il 10/01",
    order: "#24551 r15"
  },
  {
    nr: '3',
    date: "23/12/20",
    season: "202",
    line: "1",
    model: "m2200295",
    color: "cp015",
    size: "50",
    user: "ntaov",
    client: "kristina",
    feedback: "",
    order: ""
  },
  {
    nr: '4',
    date: "10/06/20",
    season: "202",
    line: "2",
    model: "m2300100",
    color: "cg217",
    size: "50",
    user: "mpetrosi",
    client: "natalia",
    feedback: "ok da Parigi, rientra il 10/01",
    order: "#24551 r15"
  },
  {
    nr: '5',
    date: "21/12/20",
    season: "202",
    line: "2",
    model: "m2200100",
    color: "cw425",
    size: "50",
    user: "ntaov",
    client: "kristina",
    feedback: "",
    order: ""
  },
  {
    nr: '6',
    date: "23/05/20",
    season: "202",
    line: "2",
    model: "m2300100",
    color: "cg217",
    size: "50",
    user: "maki",
    client: "mrochko",
    feedback: "ok da Parigi, rientra il 10/01",
    order: "#24551 r15"
  },
  {
    nr: '7',
    date: "23/12/20",
    season: "202",
    line: "2",
    model: "m2200100",
    color: "cw425",
    size: "50",
    user: "ntaov",
    client: "kristina",
    feedback: "",
    order: ""
  },
  {
    nr: '8',
    date: "23/12/20",
    season: "202",
    line: "2",
    model: "m2300100",
    color: "cg217",
    size: "50",
    user: "mpetrosi",
    client: "natalia",
    feedback: "ok da Parigi, rientra il 10/01",
    order: "#24551 r15"
  }
]

let requests = []
let originalRequests = []
let changes = {}
//create an immutable copy of the array
const headers = [
  "nr",
  "day",
  "season",
  "line",
  "model",
  "color",
  "size",
  "user",
  "client",
  "feedback",
  "order",
  "status"
];

let filter = {}
// Creating Sets to create unique values to pass to the filter
let mySets = {}
headers.forEach((field, i) => {
  mySets[`${field}s`] = new Set()
  // Richieste.filter[field] = null
});
Object.filter = (obj, filter) => {
  let key, results = []
  let queries = Object.keys(filter).filter(item => filter[item] != null)
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      let search = obj[key]
      if (queries.length > 0) {
        for (let i = 0; i < queries.length; i++) {
          let q = queries[i]
          console.log(search[q], filter[q]);
          if (!search[q].includes(filter[q])) {
            i++
          } else if (i === queries.length - 1 && search[q].includes(filter[q])) {
            results.push(search)
          }
        }
      } else {
        results = obj
      }
    }
  }
  return results
}

function itemFilter(search, filter) {
  let key, results = false
  let queries = Object.keys(filter).filter(item => filter[item] != null)
  if (queries.length > 0) {
    for (let i = 0; i < queries.length; i++) {
      let q = queries[i]
      if (!search[q].includes(filter[q])) {
        console.log('not a match');
        i++
      } else if (i === queries.length - 1 && search[q].includes(filter[q])) {
        console.log('a match');
        results = true
      }
    }
  } else {
    results = true
  }
  console.log(results);
  return results
}

let Headers = {
  view(vnode) {
    return m(".input-wrapper.flex",
      headers.map((header) => {
        return m(`.header-tag.header-${header}`, [
          m(Popover, {
            closeOnEscapeKey: true,
            content: m('.text', 'assa'),
            trigger: m(Button, {
              label: header,
              fluid: true,
              size: 'xs',
              outlined: true,
              iconLeft: Icons.FILTER
            })
          }),
          m(Input, {
            placeholder: header,
            class: `header-${header}`,
            outlined: true,
            // Filter text
            oninput: (e) => {
              Richieste.filter[header] = e.target.value.toLowerCase()
            },
            contentRight: m(Button, {
              size: 'xs',
              style: 'margin-right: 1px',
              basic: true,
              disabled: true,
              onclick: () => {
                console.log(vnode);
              }
            })
          })
        ])

      })
    )

  }
};
let MenuComponent = {
  view(vnode) {
    return m('.menu-wrapper', [
      m(Button, {
        iconLeft: Icons.PLUS,
        onclick: () => {
          Richieste.addRow()
          console.log(requests);
        }
      }),
      m(Button, {
        iconLeft: Icons.SAVE,
        label: 'Save',
        onclick: (e) => {
          let ids = Object.keys(changes)
          let fields, values

          ids.map((id, i) => {
            fields = Object.keys(changes[id])
            values = Object.values(changes[id]).join('&')
            console.log(id);
            console.log(fields, values);

            m.request({
              method: 'POST',
              url: '/api/updateRequests',
              headers: {
                id,
                idfields: fields,
                idvalues: values,
                last: i === ids.length - 1 ? true : false
              }
            }).then(res => console.log(res))
          })
        }
      })
    ])
  }
}

let Request = {
  inputs: [],
  oninit(vnode) {
    vnode.state.request = vnode.attrs.request
    vnode.state.request.nr = JSON.stringify(vnode.attrs.index)
    let originalRequest = JSON.parse(JSON.stringify(vnode.state.request))
    let {
      _id,
      nr,
      day,
      season,
      line,
      model,
      color,
      size,
      user,
      cliente,
      feedback,
      ordine,
      status
    } = vnode.state.request;

    //first push the results to res and when donw to inputs to avoid redraws
    const res = []
    for (let field in vnode.state.request) {
      if (field != '_id' && 'id') {
        let fields = Object.keys(vnode.state.request)
        res.push(m(Input, {
          class: `request-${field}`,
          data: field,
          value: vnode.state.request[field],
          readonly: field === 'nr' ? true : false,
          oncreate: (e) => {
            if (vnode.state.request[field] != originalRequest[field]) {
              //paint yellow the diffs
              vnode.state.changed = true;
              e.dom.style.background = 'rgb(255, 255, 208)'
            } else {
              vnode.state.changed = false;
              e.dom.style.background = 'none'
            }
          },
          // DIFFING
          oninput: (e) => {
            console.log(vnode.state.request, originalRequest);
            vnode.state.request[field] = e.srcElement.value.toLowerCase()
            if (vnode.state.request[field] != originalRequest[field]) {
              //paint yellow the diffs
              console.log('DIFF');
              vnode.state.changed = true;
              e.srcElement.style.background = '#ffffb0'
            } else {
              vnode.state.changed = false;
              e.srcElement.style.background = 'none'
            }
          },
          onchange: (e) => {
            let field = e.srcElement.getAttribute('data')
            // keep track of changes
            if (vnode.state.changed) {
              if (!changes[_id]) {
                changes[_id] = {}
              }
              changes[_id][field] = e.srcElement.value
            } else if (!vnode.state.changed && changes[_id][field]) {
              delete changes[_id][field]
            }
          }
        }))
        if (field === fields[fields.length - 1]) {
          vnode.state.inputs = res
        }
      }
    }
  },
  view(vnode) {
    return m(`.request.flex.text-center.request-${vnode.key}`, [
      vnode.state.inputs,
      // DELETE ROW
      m(Button, {
        iconLeft: Icons.MINUS,
        size: 'xs',
        style: 'position:absolute; right:-5px;',
        basic: true,
        onclick: (e) => {
          m.request({
            method: 'DELETE',
            url: '/api/deleteRequest',
            headers: {
              id: vnode.state.request._id
            }
          }).then(res => {
            let removed = requests.splice(requests.indexOf(vnode.state.request), 1)
            console.log(removed);
          })
        }
      })
    ])
  }
};

let Richieste = {
  filter: {},
  requests: [],
  filteredRequests: [],
  getRequests() {
    return m.request({
      url: '/api/listRequests'
    })
  },
  getDate() {
    let d = new Date()
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getYear() - 100;
    let date = `${day}.${month}.${year}`
    return date
  },
  addRow() {
    console.log('adding row')
    m.request({
      url: '/api/newRequest',
      headers: {
        day: Richieste.getDate(),
        user: 'ntaov'
      }
    }).then(res => {
      requests.push({
        _id: res._id,
        nr: '',
        date: Richieste.getDate(),
        season: "",
        line: "",
        model: "",
        color: "",
        size: "",
        user: 'ntaov',
        client: "",
        feedback: "",
        order: "",
        status: 'richiesto'
      })
    })
    console.log(requests);
  },
  filterRequests(requests, filter) {
    let res = []
    Object.filter(requests, filter).forEach((item, i) => {
      res.push(m(Request, {
        request: item,
        index: i,
        key: item._id
      }))
    })
    return res
  },
  oninit(vnode) {
    headers.forEach((field, i) => {
      vnode.state.filter[field] = null
    });
    vnode.state.getRequests().then(res => {
      originalRequests = JSON.parse(JSON.stringify(res))
      requests = res
    })
  },
  oncreate(vnode) {},
  view(vnode) {
    vnode.state.filteredRequests = vnode.state.filterRequests(requests, vnode.state.filter)
    // console.log(vnode.state.filter, vnode.state.filteredRequests);
    return m('.requests-component', [
      m(Nav),
      m(".requests-wrapper.container", [
        m("h1", "Richieste Solomeo"),
        m(MenuComponent),
        m('.table', [
          m(Headers),
          m(".requests-list", vnode.state.filteredRequests),
        ])
      ])
    ])
  }
};

exports.Richieste = Richieste