import m from 'mithril'
import {
    Input,
    Button,
    List,
    ListItem
} from 'construct-ui'

import {
    NOSALE
} from '../noSaleAI20'

import {
    Nav
} from './Nav'

export default function Basici() {
    let createListItems = () => {
        let basici = NOSALE.map(item => {
            return m(ListItem, {
                label: item
            })
        })
        return basici
    }
    let val = ''
    let list = createListItems()

    let filterResults = (list, val) => {
        console.log('filtering')
        list.forEach(item => {
            let found = item.attrs.label.search(val.toUpperCase()) >= 0 ? true : false
            if (!found) {
                item.dom.style.display = 'none'
            } else {
                item.dom.style.display = 'block'
            }
        })
    }

    return {
        oncreate(vnode) {},
        view(vnode) {
            return [m(Nav), m('.container[style=padding-top: 2rem;]',
                m(Input, {
                    placeholder: 'Insert a model/color',
                    oninput(e) {

                        val = e.target.value
                        filterResults(list, val)
                    }
                }),
                m(List, list)
                // listComponent
            )]

        }
    }
}
