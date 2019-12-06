import DEVICE_PROTOCOL from '@/static/protocol'
import { each } from '@/util/array'

const result = []
const cache = {}
const final = {
  default: 'siphost',
  list: []
}

const getProInfo = (data, name) => {
  let list = []
  for (let pro in data[name]) {
    list.push({
      id: pro.toLowerCase(),
      name: [name, '(', pro, ')'].join(''),
      port: data[name][pro].port,
      username: data[name][pro].username,
      password: data[name][pro].password,
      protocol: pro
    })
  }
  return list
}

for (let name in DEVICE_PROTOCOL) {
  let list = getProInfo(DEVICE_PROTOCOL, name)
  each(list, (info) => {
    result.push(cache[info.id] = info)
    final.list.push({
      [info.id]: info.name
    })
  })
}

export const protocol = final

export function listProtocol () {
  return result
}

export function getProtocol (id) {
  return cache[id]
}
