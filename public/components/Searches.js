import m from 'mithril'
import { List, ListItem, Tag } from 'construct-ui'


let Searches = {
  searchesList: [],
  unassignedSearches: [],
  assignedSearches: {},
  loadSearches: async () => {
    m.request({
      method: "GET",
      url: `/api/SearchInstances`
    }).then(res => {
      Searches.searchesList = res
      Searches.assignedSearches = []
      Searches.filterSearches(res)
    })
  },
  filterSearches: (searches) => {
    console.log('filtering searches');
    Searches.unassignedSearches = searches.filter(item => item.order === 'unassigned')
    searches.map(search => {
      if (search.order != 'unassigned') {
        if (!Searches.assignedSearches[search.order]) {
          Searches.assignedSearches[search.order] = []
          Searches.assignedSearches[search.order].push(search)
        } else {
          Searches.assignedSearches[search.order].push(search)
        }
      }
    })
  },
  oninit: () => {
    if (Searches.searchesList.length === 0) {
      console.log(Searches);
      Searches.loadSearches()
    }
  },
  view: () => {
    return m(List, {
      interactive: true,
      size: 'md',
      class: 'flex searches-list',
      style: 'max-height:none;flex-direction: column'
    }, Searches.searchesList.map(item => {
      return m(ListItem, {
        label: `${item.year}${item.season} ${item.model} ${item.color} ${item.size}`,
        contentRight: [
          m(Tag, {
            label: item.descr,
            size: 'sm'
          }),
          m(Tag, {
          label: '€' + item.price + ',00',
          intent: 'warning'
        })]
      })
    }))
  }
}

exports.Searches = Searches
