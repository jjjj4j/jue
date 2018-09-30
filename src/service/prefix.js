import { tpl } from '@/util/char'
import { tmp } from '@/util/storage'

export default class Prefix {
  constructor (nodeId, replace = (url) => url.replace(/\/v1/, '/{nodeId}/v1')) {
    this.nodeId = nodeId
    this.replace = replace
  }

  format (url) {
    let nodeId = this.nodeId
    return tpl(nodeId ? this.replace(url) : url, {
      nodeId
    })
  }
}

export function ApiPrefix (nodeId, replace) {
  return new Prefix(nodeId || tmp('node-id'), replace)
}
