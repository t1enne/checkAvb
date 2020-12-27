import m from 'mithril'
import {
  Button,
  Icon,
  Icons,
  Input,
  Checkbox,
  Menu,
  MenuItem,
  Popover,
  PopoverMenu,
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
const originalRequests = {}
let changes = {}
const headers = [
  "actions",
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
  mySets[`${field}Set`] = new Set()
});

function addToSets(req) {
  let vals = Object.values(req)
  let fields = Object.keys(req)

  fields.forEach((field, i) => {
    let val = vals[i]
    if (headers.indexOf(field) != -1) {
      mySets[`${field}Set`].add(val)
    }
  })
}

Object.filter = (obj, filter) => {
  let key, results = []
  let queries = Object.keys(filter).filter(item => filter[item] != null)
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      let search = obj[key]
      if (queries.length > 0) {
        for (let i = 0; i < queries.length; i++) {
          let q = queries[i]
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

function clearDiffs() {
  document.querySelectorAll('input.diffed').forEach(item => {
    item.classList.remove('diffed')
  });
  changes = {}
}

function Header(vnode) {

  let header = vnode.attrs.header
  let options = [...mySets[`${header}Set`]]
  let checkedOptions = []
  // const indeterminate = state.checkedOptions.length > 0 && state.checkedOptions < state.options.length
  // const checked = state.checkedOptions.length === state.options.length

  console.log(options);

  let filterCheckboxes = [...mySets[`${header}Set`]].map(item =>
    m(Checkbox, {
      label: item
    })
  )
  console.log(mySets);

  return {
    view(vnode) {

      return m(`.header-tag.header-${header}`, [
        m(Popover, {
          closeOnEscapeKey: true,
          content: m('.checkboxes.flex.column', [
            m(Checkbox, {
              // indeterminate,
              // checked,
              label: 'Select All',
              onchange(e) {
                // state.onCheckAll(e)
              }
            }),
            // filterCheckboxes
          ]),
          trigger: m(Button, {
            label: header,
            fluid: true,
            size: 'xs',
            outlined: true,
            disabled: header === 'actions' ? true : false
            // iconLeft: Icons.FILTER
          })
        }),
        m(Input, {
          placeholder: header,
          class: `header-${header}`,
          disabled: header === 'actions' ? true : false,
          fluid: true,
          outlined: true,
          // Filter text
          oninput: (e) => {
            Richieste.filter[header] = e.target.value.toLowerCase()
          }
        })
      ])
    }
  }
}

let Headers = {
  view(vnode) {
    return headers.map((header) => m(Header, {
      header: header
    }))
  }
};
let MenuComponent = {
  view(vnode) {
    let basic = true
    return m('.menu-wrapper', [
      m(Button, {
        iconLeft: Icons.SAVE,
        label: 'Save',
        basic,
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
            }).then(res => {
              console.log(res);
              Richieste.getRequests()
            })
          })
        }
      }),
      m(Button, {
        iconLeft: Icons.PLUS,
        basic,
        onclick: () => {
          Richieste.addRow()
          console.log(requests);
        }
      })
    ])
  }
}

let Request = {
  inputs: [],
  size: 'xs',
  reset(v) {
    console.log(v);
    // vnode.key = false
    // vnode.key = vnode.key
  },
  onupdate(vnode) {
    vnode.state.request = vnode.attrs.request
    vnode.state.request.nr = JSON.stringify(vnode.attrs.index)
    // vnode.state.reset(vnode, vnode.key)
  },
  oninit(vnode) {
    // vnode.state.originalRequest = originalRequests[vnode.attrs.request._id]
    vnode.state.request = vnode.attrs.request
    vnode.state.request.nr = JSON.stringify(vnode.attrs.index)
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

    //first push the results to res and when done to inputs to avoid redraws
    const res = []

    for (let field in vnode.state.request) {
      if (field != '_id' && 'id') {
        let fields = Object.keys(vnode.state.request)
        res.push(
          m(Input, {
            class: `request-${field} request-${_id}`,
            data: field,
            value: vnode.state.request[field],
            readonly: field === 'nr' ? true : false,
            // DIFFING
            oninput: (e) => {
              vnode.state.request[field] = e.srcElement.value.toLowerCase()
              if (vnode.state.request[field] != originalRequests[_id][field]) {
                //paint yellow the diffs
                console.log(vnode.state.request, 'diffing ' + field);
                vnode.state.changed = true;
                e.srcElement.classList.add('diffed')
              } else {
                vnode.state.changed = false;
                e.srcElement.classList.remove('diffed')
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
              console.log(changes);
            }
          }))
        if (field === fields[fields.length - 1]) {
          vnode.state.inputs = res
        }
      }
    }
  },
  view(vnode) {
    return [
      // ACTIONS MENU
      m(PopoverMenu, {
        closeOnContentClick: true,
        menuAttrs: {
          size: vnode.state.size,
          fluid: true
        },
        trigger: m(Button, {
          class: `request-${vnode.state.request._id}`,
          iconLeft: Icons.SETTINGS,
          fluid: true,
          outlined: true
        }),
        content: [
          m(MenuItem, {
            iconLeft: Icons.CHEVRON_RIGHT,
            label: 'Select Row'
          }),
          m(MenuItem, {
            label: 'Delete Row',
            iconLeft: Icons.MINUS,
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
        ]
      }),
      vnode.state.inputs,
    ]
  }
};

let Richieste = {
  filter: {},
  requests: [],
  updated: false,
  filteredRequests: [],
  async getRequests() {
    await m.request({
      url: '/api/listRequests'
    }).then(res => {

      Object.values(res).forEach(req => {
        originalRequests[req._id] = {}
        originalRequests[req._id] = JSON.parse(JSON.stringify(req))
      });
      requests = res
      // clear the DIFFS
      clearDiffs()
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
        status: 'n/a'
      })
    })
    console.log(requests);
  },
  filterRequests(requests, filter) {
    let res = []
    Object.filter(requests, filter).forEach((item, i) => {
      // push the data to Sets for the filtering checkboxes
      addToSets(item)

      res.push(m(Request, {
        request: item,
        index: i,
        key: item._id,
      }))
    })
    return res
  },
  async oninit(vnode) {
    headers.forEach((field, i) => {
      vnode.state.filter[field] = null
    });
    await vnode.state.getRequests()
    vnode.state.filteredRequests = []

  },
  view(vnode) {
    vnode.state.filteredRequests = vnode.state.filterRequests(requests, vnode.state.filter)
    // console.log(vnode.state.filter, vnode.state.filteredRequests);
    return m('.requests-component', [
      m(Nav),
      m(".requests-wrapper.container", [
        m("h1", "Richieste Solomeo"),
        m(MenuComponent),
        m('.table', [
          m(Headers, {
            k: vnode.state.filterRequests
          }),
          vnode.state.filteredRequests
        ])
      ])
    ])
  }
};

exports.Richieste = Richieste