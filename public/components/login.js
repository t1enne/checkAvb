import m from 'mithril'
import {showToast} from './Nav'


//check if session exists


let session = null

let login = {
  async check() {
    console.log('running check');
    session = await fetch('/logged').then(res => res.json())
    session.user && location.hash === '#!/login' ?
      m.route.set('/main') :
      login.set()
  },
  async set() {
    if (localStorage.smurf) {
      console.log('setting session');
      await m.request({
        method: 'POST',
        url: '/api/session',
        headers: {
          smurf: localStorage.smurf,
          user: localStorage.user
        }
      }).then(res => {
        console.log(res);
        // m.route.set('/main')
        // showToast('Relogged as ' + localStorage.user)
      })
    } else m.route.set('/login')
  },
  async authenticate(remember, user, pwd) {
    m.request({
      url: `/api/login`,
      headers: {
        'user': user,
        'pwd': pwd
      }
    }).then(res => {
      if (res.user) {
        session = res
        localStorage.smurf = session.smurf
        localStorage.user = session.user
        if (remember)
          localStorage.pwd = pwd
      }
      login.check()
    })
  }
}

exports.login = login
