import T from '../query'
import GO from '../register'

// 树
GO('/npconfig/v1/groups', function (url, args) {
  return T.fr({
    list: T.getAllByAttr('group', [])
  })
})

// 查询分组信息
GO('/npconfig/v1/group/{id}', function (url, args) {
  return T.get('group', args.id)
})

// 列举所有子分组
GO('/npconfig/v1/groups/{id}', function (url, args) {
  return T.page('group', args, [['parentId', args.id]])
})

// 删除分组
GO('/npconfig/v1/group/{id}', function (url, args) {
  return T.del('group', args.id)
}, 'delete')

GO('/npconfig/v1/groups/delete', function (url, args) {
  return T.del('group', args)
}, 'post')

// 添加视频分组
GO('/npconfig/v1/group', function (url, args) {
  return T.save('group', args)
}, 'post')

// 编辑视频分组
GO('/npconfig/v1/group/{id}', function (url, args) {
  return T.save('group', args)
}, 'post')

// 节点信息
GO('/npconfig/nodes/self', function (url, args) {
  return T.get('group', '004')
})

// 配置节点信息
GO('/npconfig/nodes/self', function (url, args) {
  return T.fr({})
}, 'post')

GO('/npconfig/v1/common/adjust/groups/sort', function (url, args) {
  return T.fr()
}, 'put')

GO('/npconfig/v1/group/name/check', function () {
  return T.fr()
}, 'post')
