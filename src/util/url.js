import { each } from './ajax'
import { setNavHistory, setUrlHistory } from './storage'
import { isChar, isDefined } from '@/util/core'

export function go (router, url) {
  if (isChar(router)) {
    location.href = router
  } else {
    if (isDefined(url)) {
      let list = url.split('/')
      if (list.length === 3) {
        setNavHistory(list[1], url)
        setUrlHistory(url)
      }
      router.push({ path: url })
    }
  }
}
export function format () {
  let search = location.search
  let params = {}
  if (search) {
    let param
    search = search.slice(1)
    each(search.split('&'), function (obj) {
      param = obj.split('=')
      if (param[0]) {
        params[param[0]] = param[1]
      }
    })
  }
  return params
}
