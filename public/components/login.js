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
        } else if (!localStorage.pwd) {
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
        }).then(async res => {
            if (res.user) {
                session = res
                localStorage.smurf = session.smurf
                localStorage.user = session.user
                if (remember) localStorage.pwd = pwd
                showToast(`Welcome back ${localStorage.user} !`, 'primary')
            }
            await login.check()
            // FORCING SEARCH SINCE AWAIT DOESNT SEEM TO WORK PROPERLY in app.js
            if (document.querySelector('.model input').value != '' && res.user) {
                document.querySelector('.buttons-group button:nth-child(2)').click()
            } else {
                showToast('Somethings is wrong, please try logging in on websmart.brunellocucinelli.it', 'negative')
            }
            return res.user ? true : false
        })
    }
}

exports.login = login
