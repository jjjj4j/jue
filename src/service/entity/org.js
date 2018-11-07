import T from '../query'
import GO from '../register'

// 查询所有组织机构
GO('/npauth/v1/organizations', function (url, args) {
  return T.fr({
    'list': T.getAllByAttr('org')
  })
})

GO('/npauth/v1/sort/list/child/orgs/{currentPage}/{pageSize}', function (url, args) {
  return T.page('org', args, args.id && [['parentId', args.id]])
})

GO('/npauth/v1/organization/{id}', function (url, args) {
  return T.get('org', args.id)
})

GO('/npauth/v1/organization', function (url, args) {
  return T.save('org', args)
}, 'post')

GO('/npauth/v1/organization/{id}', function (url, args) {
  return T.save('org', args)
}, 'put')

// 本级组织结构
GO('/npauth/v1/self/organizations', function (url, args) {
  return T.fr({
    'list': T.getAllByAttr('org')
  })
})
