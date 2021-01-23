import m from 'mithril'
import {
  showToast
} from './Nav'


//check if session exists


let session = null

let login = {
  async check() {
    console.log('running check');
    if (localStorage.smurf && location.hash === '#!/login') {
      m.route.set('/main')
    } else {
      m.route.set('/login')
    }
  },
  async setDev() {
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
        'user': user.toLowerCase(),
        'pwd': pwd.toLowerCase()
      }
    }).then(res => {
      if (res.user) {
        session = res
        localStorage.smurf = session.smurf
        localStorage.user = session.user
        if (remember) localStorage.pwd = pwd
        showToast(`Welcome back ${localStorage.user} !`, 'primary')
      }
      login.check()
    })
  }
}

exports.login = login