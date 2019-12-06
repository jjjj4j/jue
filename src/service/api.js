export function listService (prefix) {
  prefix = prefix || ''
  return [
    /* 系统登录 */
    ['login', '/npauth/v1/NPUSER/tokens', 'post'], // 登录
    ['adminLogin', '/npauth/v1/admin/login/tokens', 'post'], // admin 登录
    ['logout', '/npauth/v1/tokens/{tokenKey}', 'delete'], // 登出
    ['getUserByToken', '/npauth/v1/user/tokens/{tokenKey}', 'get'], // 获取用户信息
    ['permitLogin', '/npauth/v1/function/tokens/{tokenKey}', 'get'], // 列举登陆用户权限信息
    ['listIp', '/npauth/v1/client/ips', 'get'], // 获取客户端IP
    ['pkiLogin', '/npauth/v1/PKI/tokens', 'post'], // PKI 登录
    ['veinLogin', '/npauth/v1/FINGER/tokens', 'post'], // 指静脉登录
    ['editPassword', '/npauth/v1/update/user/password', 'put'], // 修改密码
    ['editAdminPassword', '/npauth/v1/update/admin/password', 'put'], // 修改Admin密码
    ['finalProtocol', '/npconfig/v1/protocol/{type}', 'get'], // 获取协议

    /* 行政关系 */
    ['pageAdRalation', '/npauth/v1/{type}/node/relations/{currentPage}/{pageSize}', 'get'], // 列表
    ['getAd', '/npauth/v1/node/{id}/relation', 'get'],
    ['addAd', '/npauth/v1/add/node/relation', 'post'],
    ['editAd', '/npauth/v1/node/{id}/relation', 'put'],
    ['delAd', '/npauth/v1/delete/{nodeId}/node/relation', 'delete'],
    ['getSelfOrg', '/npauth/v1/self/organizations', 'get'],
    ['checkAdIP', '/npauth/v1/node/relation/ip/check', 'post'],

    /* 组织机构 */
    ['allOrg', '/npauth/v1/organizations', 'get'], // 查询所有组织机构
    ['pageOrg', '/npauth/v1/sort/list/child/orgs/{currentPage}/{pageSize}', 'get'], // 分页查询组织机构
    ['addOrg', '/npauth/v1/organization', 'post'], // 组织机构添加
    ['delOrg', '/npauth/v1/delete/organizations', 'post'], // 删除组织机构
    ['editOrg', '/npauth/v1/organization/{id}', 'put'], // 组织机构修改
    ['getOrg', '/npauth/v1/organization/{id}', 'get'], // 查询组织机构
    ['checkOrgName', '/npauth/v1/org/name/check', 'post'], // 查询名称是否重复
    ['checkOrgNo', '/npauth/v1/org/no/check', 'post'], // 查询编号是否重复
    ['orderOrg', '/npauth/v1/common/adjust/orgs/sort', 'put'], // 排序

    /* 角色 */
    ['allRole', '/npauth/v1/{type}/roles', 'get'], // 查询所有角色
    ['pageRole', '/npauth/v1/{type}/roles/split/page/{currentPage}/{pageSize}', 'get'], // 分页查询角色
    ['addRole', '/npauth/v1/role', 'post'], // 添加角色
    ['delRole', '/npauth/v1/delete/roles', 'post'], // 批量删除角色
    ['editRole', '/npauth/v1/role/{id}', 'put'], // 编辑角色
    ['getRole', '/npauth/v1/role/{id}', 'get'], // 查询角色
    ['checkRoleName', '/npauth/v1/role/name/check', 'post'], // 查询名称是否重复
    ['checkRoleNo', '/npauth/v1/role/code/check', 'post'], // 查询编号是否重复

    /* 用户 */
    ['allUser', '/npauth/v1/users', 'get'], // 查询所有用户
    ['pageUser', '/npauth/v1/recursion/organization/users/{id}', 'get'], // 分页查询组织下用户
    ['listUser', '/npauth/v1/organization/{id}/users', 'get'], // 查询组织下所有用户
    ['addUser', '/npauth/v1/config/user', 'post'], // 添加用户
    ['delUser', '/npauth/v1/delete/users', 'post'], // 批量删除用户
    ['editUser', '/npauth/v1/config/user', 'put'], // 编辑用户
    ['getUser', '/npauth/v1/user/{id}', 'get'], // 查询用户
    ['checkUserName', '/npauth/v1/user/login/name/check', 'post'], // 查询名称是否重复
    ['checkUserGbId', '/npauth/v1/user/gb/id/check', 'post'], // 查询国标编号是否重复
    ['checkUserIdCardNo', '/npauth/v1/user/idcard/check', 'post'], // 查询证件号是否重复

    /* 权限 */
    ['permitFunList', '/npauth/v1/systems/functions', 'get'], // 功能权限列表
    ['permitUserFun', '/npauth/v1/users/{id}/function_permissions', 'get'], // 用户的功能权限
    ['permitRoleFun', '/npauth/v1/roles/{id}/function_permissions', 'get'], // 角色的功能权限
    ['permitRes', '/npconfig/v1/permission/{id}', 'get'], // 资源权限查询(包含用户和角色)
    ['editRes', '/npconfig/v1/permission/v2/{id}', 'post'], // 资源权限保存(包含用户和角色)
    ['editUserFun', '/npauth/v1/users/{id}/config/function_permissions', 'post'], // 用户功能权限保存
    ['editRoleFun', '/npauth/v1/roles/{id}/config/function_permissions', 'post'], // 角色功能权限保存
  
    ['listGroupPermit', '/npauth/v1/list', 'get'], // 资源权限查询(包含用户和角色)
    ['getSelfPermit', '/npconfig/v1/{id}/self/{userId}', 'get'], // 资源权限保存(包含用户和角色)
    ['editGroupRes', '/npauth/v1/{id}/{userId}/{checked}', 'put'], // 资源权限保存(包含用户和角色)
    ['listCameraPermit', '/npconfig/v1/auth/{id}/{userId}', 'get'], // 资源权限保存(包含用户和角色)
    ['saveResPermit', '/npauth/v1/camera/permission', 'post'], // 资源权限保存(包含用户和角色)
    
    /* 资源屏蔽 */
    ['pageShield', '/npconfig/v1/emergency/events', 'get'], // 查询所有屏蔽事件
    ['getShield', '/npconfig/v1/emergency/event/{id}', 'get'], // 查询屏蔽事件
    ['addShield', '/npconfig/v1/emergency/event', 'post'], // 添加屏蔽事件
    ['editShield', '/npconfig/v1/emergency/event/{id}', 'post'], // 编辑屏蔽事件
    ['delShield', '/npconfig/v1/emergency/event/delete', 'post'], // 删除屏蔽事件

    /* 节点信息 */
    ['getNode', '/npconfig/v1/nodes/self', 'get'], // 获取节点信息
    ['setNode', '/npconfig/v1/nodes/self', 'post'], // 修改节点信息
    ['nodeLicense', '/npconfig/v1/pvgplus/GetLicenseInfo', 'post'], // 节点权限信息

    /* 节点上级 */
    ['pageParentNode', '/npconfig/v1/cascade/relations/leaders/{model}', 'get'], // 上级分页列表
    ['addParentNode', '/npconfig/v1/cascade/relations/leader/{model}', 'post'], // 添加向上同步配置
    ['delParentNode', '/npconfig/v1/cascade/relations/leader/{id}', 'get'], // 删除向上同步配置
    ['editParentNode', '/npconfig/v1/cascade/relations/leader/{model}', 'post'], // 编辑向上同步配置
    ['getParentNode', '/npconfig/v1/cascade/relations/config/{model}', 'get'], // 获取上级节点信息
    ['connectParentNode', '/npconfig/v1/cascade/relations/remoteNodeId/{model}', 'get'], // 验证上级是否存在

    /* 节点下级 */
    ['pageChildNode', '/npconfig/v1/cascade/relations/members/{model}', 'get'], // 获取下级节点
    ['listChildChecked', '/npconfig/v1/cascade/relations/synchronized/{id}', 'get'], // 获取已勾选的摄像机
    ['listChildGroup', '/npconfig/v1/cascade/relations/memberGroups/{id}', 'get'], // 获取下级节点的分组
    ['listChildCamera', '/npconfig/v1/cascade/relations/resource/{relationId}', 'get'], // 获取下级节点的摄像机
    ['saveRelationData', '/npconfig/v1/cascade/relations/synchronized/{id}', 'post'], // 拉取向上同步的数据
    ['getNodeStatus', '/npconfig/v1/cascade/relations/relationStatus/{id}', 'get'], // 获取上级节点信息
    ['delChildNode', '/npconfig/v1/cascade/relations/rejectMember/{id}', 'post'], // 打回

    ['pageRelationUpdate', '/npconfig/v1/cascade/relations/changedResource/{id}', 'get'], // 获取下级变更数据
    ['saveRelationUpdate', '/npconfig/v1/cascade/relations/synchronizedChange/{id}', 'post'], // 保存下级变更数据

    /* 外部认证 */
    ['allOtherOS', '/npauth/v1/authServers', 'get'], // 查询所有外部认证
    ['pageOtherOS', '/npauth/v1/authServers/{currentPage}/{pageSize}', 'get'], // 分页查询外部认证
    ['addOtherOS', '/npauth/v1/authServer', 'post'], // 添加外部认证
    ['delOtherOS', '/npauth/v1/delete/authServers', 'post'], // 批量删除外部认证
    ['editOtherOS', '/npauth/v1/authServer/{id}', 'put'], // 编辑外部认证
    ['getOtherOS', '/npauth/v1/authServer/{id}', 'get'], // 查询外部认证

    /* 服务 */
    ['pageServer', '/npconfig/v1/servers', 'get'], // 服务器分页列举
    ['listServerByType', '/npconfig/v1/servers/{type}', 'get'], // 根据类型获取服务
    ['listPauComponent', '/npconfig/v1/pau/moduleinfo', 'get'], // 获取PAU组件
    ['addServer', '/npconfig/v1/server', 'post'], // 添加服务
    ['delServer', '/npconfig/v1/servers/batch_delete', 'post'], // 批量删除服务
    ['editServer', '/npconfig/v1/server/{id}', 'post'], // 编辑服务
    ['getServer', '/npconfig/v1/server/{id}', 'get'], // 获取指定服务

    /* 平台关系 */
    ['pagePlatform', '/npconfig/v1/platform/page', 'get'],
    ['listPlatformUser', '/npconfig/v1/platform/user/list', 'get'],
    ['listPlatformEncoder', '/npconfig/v1/platform/codec/encoder', 'get'],
    ['listPlatformDecoder', '/npconfig/v1/platform/codec/decoder', 'get'],
    ['listChannelByDevice', '/npconfig/v1/platform/codec_channel/{codeId}', 'get'],
    ['addPlatform', '/npconfig/v1/platform', 'post'],
    ['delPlatform', '/npconfig/v1/platform/batch_delete', 'post'],
    ['editPlatform', '/npconfig/v1/platform/{id}', 'put'],
    ['getPlatform', '/npconfig/v1/platform/{id}', 'get'],
    ['subscribeDirectory', '/npconfig/v1/platform/gbPlatform/notify/{id}', 'get'],
    ['updateRegistryStatus', '/npconfig/v1/platform/register/status/{id}/{status}', 'put'],

    /* 国标下级数据同步 */
    ['listGbChecked', '/npconfig/v1/gbCache/checked/{id}', 'get'], // 获取已勾选的摄像机
    ['listGbGroup', '/npconfig/v1/gbCache/groups/{id}', 'get'], // 获取下级节点的分组
    ['listGbCamera', '/npconfig/v1/gbCache/{platformId}', 'get'], // 获取下级节点的摄像机
    ['saveGbData', '/npconfig/v1/gbCache/accept/{id}', 'post'], // 拉取向上同步的数据
    ['delGbNode', '/npconfig/v1/gbCache/rejectMember/{id}', 'post'], // 打回
    ['getCameraNumber4Gb', '/npconfig/v1/gbCache/cameraNumber/{id}', 'get'], // 获取下级国标平台同步的摄像机数量

    ['pageGbRelationUpdate', '/npconfig/v1/gbCache/changed/{id}', 'get'], // 获取下级变更数据
    ['saveGbRelationUpdate', '/npconfig/v1/gbCache/changedUpdate/{id}', 'post'], // 保存下级变更数据

    /* 视频分组 */
    ['allGroup', '/npconfig/v1/groups', 'get'],
    ['pageGroup', '/npconfig/v1/groups/{id}', 'get'],
    ['addGroup', '/npconfig/v1/group', 'post'],
    ['delGroup', '/npconfig/v1/groups/delete', 'post'],
    ['editGroup', '/npconfig/v1/group/{id}', 'post'],
    ['getGroup', '/npconfig/v1/group/{id}', 'get'],
    ['orderGroup', '/npconfig/v1/common/adjust/groups/sort', 'put'], // 排序
    ['checkGroupName', '/npconfig/v1/group/name/check', 'post'], // 分组名称标示重复检查
    ['checkGroupCode', '/npconfig/v1/group/code/check', 'post'], // 分组唯一标示重复检查

    /* 业务分组-虚拟组织 */
    ['allBusinessGroup', '/npconfig/v1/businessGroups', 'get'], // 获取所有业务分组
    ['allVirtualGroup', '/npconfig/v1/virtualOrgs', 'get'], // 获取所有虚拟组织
    ['pageGroupByBusiness', '/npconfig/v1/virtualOrgs/businessGroup/{id}', 'get'],
    ['pageGroupByVirtual', '/npconfig/v1/virtualOrgs/{id}', 'get'],
    ['addBusinessGroup', '/npconfig/v1/businessGroup', 'post'],
    ['addVirtualGroup', '/npconfig/v1/virtualOrg', 'post'],
    ['delBusinessGroup', '/npconfig/v1/businessGroup/{id}', 'delete'],
    ['delVirtualGroup', '/npconfig/v1/virtualOrgs/delete', 'post'],
    ['editBusinessGroup', '/npconfig/v1/businessGroup/{id}', 'put'],
    ['editVirtualGroup', '/npconfig/v1/virtualOrg/{id}', 'put'],
    ['getBusinessGroup', '/npconfig/v1/businessGroup/{id}', 'get'],
    ['getVirtualGroup', '/npconfig/v1/virtualOrg/{id}', 'get'],
    ['listCameraByVirtualGroup', '/npconfig/v1/devices/virtualOrg/{id}', 'get'],
    ['saveCamera4VirtualGroup', '/npconfig/v1/virtualOrgDeviceRelations', 'post'],

    /* 编码设备 */
    ['pageEncoder', '/npconfig/v1/encoders/{id}', 'get'], // 列举所有分组
    ['addEncoder', '/npconfig/v1/device/encoder', 'post'], // 添加
    ['addEncoderList', '/npconfig/v1/device/encoders', 'post'], // 批量添加
    ['getEncoder', '/npconfig/v1/device/encoder/{id}', 'get'], // 获取指定编码设备
    ['checkDeviceGb', '/npconfig/v1/device/gb/check', 'post'], // 设备国标编号是否重复

    /* 解码设备 */
    ['pageDecoder', '/npconfig/v1/decoders/{id}', 'get'], // 列举所有分组
    ['addDecoder', '/npconfig/v1/device/decoder', 'post'], // 添加
    ['addDecoderList', '/npconfig/v1/device/decoders', 'post'], // 批量添加
    ['getDecoder', '/npconfig/v1/device/decoder/{id}', 'get'], // 获取指定解码设备

    ['allPau', '/npconfig/v1/servers/pau', 'get'], // 获取所有PAU
    ['sipPau', '/npconfig/v1/servers/sippau', 'get'], // 获取所有国标PAU
    ['editCoder', '/npconfig/v1/device/{id}', 'post'], // 编辑编码或解码设备
    ['delCoder', '/npconfig/v1/devices/delete', 'post'], // 批量删除编码或解码设备

    /* 摄像机 */
    ['allCamera', '/npconfig/v1/cameras', 'get'],
    ['pageCamera', '/npconfig/v1/cameras/{id}', 'get'],
    ['listCamera', '/npconfig/v1/cameras/group/{id}', 'get'],
    ['delCamera', '/npconfig/v1/cameras/delete', 'post'],
    ['editCamera', '/npconfig/v1/camera/{id}', 'post'],
    ['getCamera', '/npconfig/v1/camera/{id}', 'get'],

    ['addCamera4Device', '/npconfig/v1/camera', 'post'],
    ['batchVideoFlow', '/npconfig/v1/camera/batchSetUp/transport', 'post'],
    ['batchVideoFsw', '/npconfig/v1/camera/batchSetUp/fs', 'post'],
    ['batchVideoGroup', '/npconfig/v1/camera/batchSetUp/group', 'post'],
    ['batchVideoPtz', '/npconfig/v1/camera/batchSetUp/ptz', 'post'],
    ['emergencyPermitCamera', '/npconfig/v1/emergency/camera/{id}', 'get'],
    ['getCameraCount', '/npconfig/v1/camera/count', 'get'], // 节点内摄像机总数

    /* 监视器 */
    ['allMonitor', '/npconfig/v1/monitors', 'get'], // 列举所有监视器
    ['pageMonitor', '/npconfig/v1/monitors/{id}', 'get'], // 分页列举
    ['listMonitor', '/npconfig/v1/monitors/group/{id}', 'get'], // 列举分组下所有
    ['delMonitor', '/npconfig/v1/monitors/delete', 'post'], // 批量删除监视器
    ['editMonitor', '/npconfig/v1/monitor/{id}', 'post'], // 编辑监视器
    ['getMonitor', '/npconfig/v1/monitor/{id}', 'get'], // 获取指定监视器
    ['checkMonitorNo', '/npconfig/v1/monitor/monitorNo/check', 'post'], // 查询监视器编号是否重复

    /* 通道 */
    ['listRealChannels', '/npconfig/v1/device/channel_info/{type}/{deviceId}', 'get'], // 获取实际通道
    ['listChannels', '/npconfig/v1/channels/device/{deviceId}', 'get'], // 设备下的通道信息
    ['delChannelById', '/npconfig/v1/codec/{id}', 'delete'], // 删除通道
    
    /* 通道 - 编码器 */
    ['batchAddCameraChannel', '/npconfig/v1/cameras', 'post'], // 设备下批量添加摄像机(通道)
    ['batchAddCoderChannel', '/npconfig/v1/codecs', 'post'], // 设备下批量添加编解码(通道)
    ['delCameraChannel', '/npconfig/v1/camera/{id}', 'delete'], // 删除摄像机(通道)

    ['checkCameraNo', '/npconfig/v1/camera/id/check', 'post'], // 摄像机唯一标识重复检查
    ['checkCameraChannelNo', '/npconfig/v1/camera/channelNo/check', 'post'], // 摄像机通道号重复检查
    ['checkCameraGb', '/npconfig/v1/camera/gb/check', 'post'], // 摄像机国标重复检查

    /* 通道 - 解码器 */
    ['batchAddMonitorChannel', '/npconfig/v1/monitors', 'post'], // 设备下批量添加通道
    ['delMonitorChannel', '/npconfig/v1/monitor/{id}', 'delete'], // 删除监视器（通道）

    ['checkMonitorChannelNo', '/npconfig/v1/monitor/channelNo/check', 'post'], // 监视器通道号重复检查
    ['checkMonitorGb', '/npconfig/v1/monitor/gb/check', 'post'], // 监视器国标重复检查

    /* 编解码通道 */
    ['pageChannel', '/npconfig/v1/codecs/{id}', 'get'], // 列举分组下所有
    ['delChannel', '/npconfig/v1/codecs/delete', 'post'], // 批量删除编解码通道
    ['editChannel', '/npconfig/v1/codec/{id}', 'post'], // 编辑编解码通道
    ['getChannel', '/npconfig/v1/codec/{id}', 'get'], // 获取指定编解码通道

    /* 键盘 */
    ['allKbUser', '/npconfig/v1/keyboard/user/list', 'get'], // 键盘用户列表
    ['pageKeyboard', '/npconfig/v1/keyboards', 'get'], // 列举所有
    ['addKeyboard', '/npconfig/v1/keyboard', 'post'], // 添加键盘
    ['delKeyboard', '/npconfig/v1/keyboards', 'post'], // 删除键盘
    ['editKeyboard', '/npconfig/v1/keyboard/{id}', 'put'], // 编辑键盘
    ['getKeyboard', '/npconfig/v1/keyboard/{id}', 'get'], // 获取指定键盘
    ['checkKbName', '/npconfig/v1/keyboard/name/check', 'post'], // 键盘名称重复检查

    /* 录像模板 */
    ['allVideoTpl', '/npconfig/v1/videoPlanTemplates', 'get'], // 列举所有
    ['pageVideoTpl', '/npconfig/v1/videoPlanTemplates', 'get'], // 分页列举所有
    ['addVideoTpl', '/npconfig/v1/videoPlanTemplate', 'post'], // 添加录像模板
    ['delVideoTpl', '/npconfig/v1/videoPlanTemplates/batch_delete', 'post'], // 删除录像模板
    ['editVideoTpl', '/npconfig/v1/videoPlanTemplate/{id}', 'put'], // 编辑录像模板
    ['getVideoTpl', '/npconfig/v1/videoPlanTemplate/{id}', 'get'], // 获取录像模板

    ['batchVideoPlan', '/npconfig/v1/videoplan', 'post'], // 批量编辑录像计划 (摄像机列表页面)
    ['getVideoPlan', '/npconfig/v1/videoplan/{id}', 'get'], // 获取录像计划 (摄像机列表页面)
    ['editVideoPlan', '/npconfig/v1/videoplan/{id}', 'put'], // 编辑录像计划 (摄像机列表页面)

    /* 模板信息 */
    ['tplInfo', '/{system}/v1/{name}/template/info', 'get']
  ].map(function (v) {
    v[1] = prefix + v[1]
    if (v[2] === 'post' || v[2] === 'put') {
      v[3] = v[3] || 'text/plain'
    }
    return v
  })
}
