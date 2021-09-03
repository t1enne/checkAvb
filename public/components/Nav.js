import m from 'mithril'

import {
    Button,
    Icon,
    Icons,
    Menu,
    MenuItem,
    Drawer,
    Tag,
    Breadcrumb,
    BreadcrumbItem,
    Toaster
} from 'construct-ui'

import logo from '../logo.svg'

const AppToaster = new Toaster();

function showToast(msg, intent) {
    AppToaster.show({
        message: msg,
        icon: Icons.BELL,
        intent: intent,
        timeout: 2000
    })
}

let DrawerContent = {
    drawerOpen: false,
    class: 'drawer',
    size: 'xl',
    view: (vnode) => {
        return [m(Button, {
            size: vnode.state.size,
            iconLeft: Icons.MENU,
            style: 'align-self:end',
            basic: true,
            onclick: () => {
                vnode.state.drawerOpen = !vnode.state.drawerOpen
                m.redraw()
            }
        }), m(Drawer, {
            closeOnOutsideClick: true,
            closeOnEscapeKey: true,
            onClose: () => vnode.state.drawerOpen = false,
            hasBackdrop: true,
            position: 'right',
            isOpen: vnode.state.drawerOpen,
            content: m('.drawer-nav',
                m(Button, {
                    iconLeft: Icons.CHEVRON_RIGHT,
                    basic: true,
                    style: 'float:right;',
                    onclick() {
                        vnode.state.drawerOpen = false
                    }
                }),
                m(m.route.Link, {
                    href: '/main'
                }, m(Button, {
                    iconLeft: Icons.SEARCH,
                    basic: true,
                    fluid: true,
                    align: 'left',
                    label: 'Availability',
                    size: vnode.state.size
                })),
                m(m.route.Link, {
                    href: '/orders'
                }, m(Button, {
                    iconLeft: Icons.LIST,
                    fluid: true,
                    basic: true,
                    label: 'Orders',
                    align: 'left',
                    size: vnode.state.size
                })),
                m(m.route.Link, {
                    href: '/clients'
                }, m(Button, {
                    iconLeft: Icons.USERS,
                    fluid: true,
                    basic: true,
                    align: 'left',
                    label: 'Clienti',
                    size: vnode.state.size
                })),
                m(m.route.Link, {
                    href: '/basici'
                }, m(Button, {
                    iconLeft: Icons.TRELLO,
                    fluid: true,
                    basic: true,
                    align: 'left',
                    label: 'Basici',
                    size: vnode.state.size
                })),
                m(m.route.Link, {
                    href: '/history'
                }, m(Button, {
                    iconLeft: Icons.ARCHIVE,
                    fluid: true,
                    basic: true,
                    align: 'left',
                    label: 'History',
                    size: vnode.state.size
                })),
                // m(Button, {
                //   iconLeft: Icons.TRUCK,
                //   fluid: true,
                //   basic: true,
                //   align: 'left',
                //   label: 'Richieste',
                //   size: vnode.state.size
                // })),
                // m(m.route.Link, {
                //   href: '/dhlTracking'
                // }, m(Button, {
                //   iconLeft: Icons.BOX,
                //   fluid: true,
                //   basic: true,
                //   align: 'left',
                //   label: 'DHL tracking',
                //   size: vnode.state.size
                // })),
                m('.last-row', (m(Button, {
                        intent: 'primary',
                        size: vnode.state.size,
                        iconLeft: Icons.USER,
                        fluid: true,
                        // label: session.user ? session.user : 'LOGINPC',
                        onclick: () => vnode.state.menuOpen = !vnode.state.menuOpen
                    }),
                    m(Menu, {
                        size: vnode.state.size,
                        basic: true
                    }, m(Tag, {
                        label: localStorage.user,
                    }), m(MenuItem, {
                        iconLeft: Icons.LOG_OUT,
                        label: 'Log Out',
                        onclick: () => {
                            // localStorage.clear()
                            m.request({
                                    url: '/api/logout'
                                })
                                .then(res => {
                                    console.log(res);
                                    m.route.set('/login')
                                })
                        }
                    })))))
        })]
    }
}

let Nav = {
    buttonOptions: {
        iconLeft: Icons.HOME,
        size: 'lg',
        basic: true,
        onclick() {
            m.route.set('/home')
        }
    },
    // navHomeButton: true ? { IconLeft: Icons.HOME } : { iconLeft: Icons.CHEVRON_LEFT },
    oninit(vnode) {

        if (location.hash != '#!/main') vnode.state.buttonOptions = {
            iconLeft: Icons.CHEVRON_LEFT,
            label: 'Back',
            size: 'lg',
            basic: true,
            onclick() {
                history.back()
            }
        }
    },
    view: (vnode) => {
        // let submenu = location.hash.split('/')[1]

        return [m('.nav.flex.space-b',
                //   m(Breadcrumb, {
                //     size: 'xl',
                //     class: 'breadcrumbs',
                //     seperator: m(Icon, { name: Icons.CHEVRON_RIGHT })
                //   },
                //   m(BreadcrumbItem, {
                //     href: '/#!/main'
                //   }, m(Icon, {
                //     name: Icons.HOME
                //   })),
                //   m(BreadcrumbItem, {
                //     href: `/#!/${submenu}`
                //   }, m('a.breadcrumbs', submenu))
                //
                // ),
                m(Button, vnode.state.buttonOptions),
                m(`img.logo[src=${logo}][alt='logo']`),
                m(DrawerContent)),
            m(AppToaster, {
                position: 'top'
            })
        ]
    }
}

exports.Nav = Nav
exports.showToast = showToast
