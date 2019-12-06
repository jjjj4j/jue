import T from '../query'
import GO from '../register'

// 列举所有分组
GO('/npconfig/v1/encoders/{id}', function (url, args) {
  return T.page('encoder', args, [['groupId', args.id]])
})

// 编码设备添加
GO('/npconfig/v1/device/encoder', function (url, args) {
  return T.save('encoder', args, false)
}, 'post')

// 编辑编码或解码设备
GO('/npconfig/v1/device/{id}', function (url, args) {
  if (args.useType === 'monitor' || args.useType === 'codec') {
    return T.save('decoder', args, false)
  } else {
    return T.save('encoder', args, false)
  }
}, 'post')

// 删除编码或解码设备
GO('/npconfig/v1/device/{id}', function (url, args) {
  return T.del('encoder', args.id)
}, 'delete')

// 获取指定编码设备
GO('/npconfig/v1/device/encoder/{id}', function (url, args) {
  return T.get('encoder', args.id)
})

// 批量删除编码或解码设备
GO('/npconfig/v1/devices/delete', function (url, args) {
  return T.del('encoder', args)
}, 'post')

// 批量添加
GO('/npconfig/v1/device/encoders', function (url, args) {
  return T.fr({})
}, 'post')

// 设备国标编号重复审查

GO('/npconfig/v1/device/gb/check', function (url, args) {
  return T.fr({ status: false })
}, 'post')
