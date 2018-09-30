let Prefix = function (nodeId) {
  this.nodeId = nodeId
}

Prefix.prototype.format = function (url) {
  let nodeId = this.nodeId
  return $.tpl(nodeId ? url.replace(/\/v1/, '/{nodeId}/v1') : url, {
    nodeId
  })
}

$.extend({
  ApiPrefix (nodeId) {
    return new Prefix(nodeId || $.tmp('node-id'))
  }
})

export default Prefix
