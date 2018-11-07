import T from '../query'
import GO from '../register'

/** ----------------------------PVM----------------------------------**/

// 列举所有摄像机列表
GO('/npconfig/v1/cameras', function (url, args) {
  return T.page('camera', (args.pageSize = 1000, args), [['groupId', args.groupId]])
})

// 列举组织机构下的摄像机信息
GO('/npconfig/v1/cameras/group/{id}', function (url, args) {
  return T.page('camera', args, [['groupId', args.id]])
})

// 列举组织机构下的摄像机信息(分页)
GO('/npconfig/v1/cameras/{id}', function (url, args) {
  return T.page('camera', args, [['groupId', args.id]])
})
