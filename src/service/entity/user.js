import T from '../query'
import GO from '../register'

// 查询组织下所有用户
GO('/npauth/v1/organization/{id}/users', function (url, args) {
  return T.fr({
    'list': T.getAllByAttr('user', [['orgId', args.id]])
  })
})

// 分页查询组织下用户
GO('/npauth/v1/recursion/organization/users/{currentPage}/{pageSize}', function (url, args) {
  return T.page('user', args, [['orgId', args.id]])
})

GO('/npauth/v1/users', function (url, args) {
  return T.fr({
    'list': T.getAllByAttr('user', [], function () {
      if (args.search) {
        for (let attrName in this) {
          let attr = this[attrName]
          if (typeof attr === 'string' && attr.indexOf(args.search) >= 0) {
            return true
          }
        }
        return false
      }
      return true
    })
  })
})

// 单条查询
GO('/npauth/v1/user/{id}', function (url, args) {
  return T.get('user', args.id)
})

// 删除
GO('/npauth/v1/user/{id}', function (url, args) {
  return T.delete('user', args.id)
}, 'delete')

// 批量删除
GO('/npauth/v1/delete/users', function (url, args) {
  return T.delByIds('user', args)
}, 'post')

// 修改
GO('/npauth/v1/config/user', function (url, args) {
  return T.save('user', args)
}, 'put')

// 添加
GO('/npauth/v1/config/user', function (url, args) {
  return T.save('user', args)
}, 'post')

// 修改密码
GO('/npauth/v1/update/user/password', function (url, args) {
  return T.fr()
}, 'put')

// 修改 Admin 密码
GO('/npauth/v1/update/admin/password', function (url, args) {
  return T.fr()
}, 'put')

// 登录名称重复检查
GO('/npauth/v1/user/login/name/check', function (url, args) {
  return T.fr({
    status: !1
  })
}, 'post')

// 国标编号重复检查
GO('/npauth/v1/user/gb/id/check', function (url, args) {
  return T.fr({
    status: !1
  })
}, 'post')

// 证件号重复检查
GO('/npauth/v1/user/idcard/check', function (url, args) {
  return T.fr({
    status: !1
  })
}, 'post')
