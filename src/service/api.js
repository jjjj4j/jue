var listService = function (prefix) {
  prefix = prefix || ''
  return [
    /* 系统登录 */
    ['login', '/npauth/v1/NPUSER/tokens', 'post'], //登录
    ['adminLogin', '/npauth/v1/admin/login/tokens', 'post'], //admin 登录
    ['logout', '/npauth/v1/tokens/{tokenKey}', 'delete'], //登出
    ['getUserByToken', '/npauth/v1/user/tokens/{tokenKey}', 'get'], //获取用户信息
    ['permitLogin', '/npauth/v1/function/tokens/{tokenKey}', 'get'], //列举登陆用户权限信息
    ['listIp', '/npauth/v1/client/ips', 'get'], //获取客户端IP
    ['pkiLogin', '/npauth/v1/PKI/tokens', 'post'], //PKI 登录
    ['veinLogin', '/npauth/v1/FINGER/tokens', 'post'], //指静脉登录
    ['editPassword', '/npauth/v1/update/user/password', 'put'], //修改密码
    ['editAdminPassword', '/npauth/v1/update/admin/password', 'put'], //修改Admin密码
    ['finalProtocol', '/npconfig/v1/protocol/{type}', 'get'], //获取协议

    /* 行政关系 */
    ['pageAdRalation', '/npauth/v1/{type}/node/relations/{currentPage}/{pageSize}', 'get'],  //列表
    ['getAd', '/npauth/v1/node/{id}/relation', 'get'],
    ['addAd', '/npauth/v1/add/node/relation', 'post'],
    ['editAd', '/npauth/v1/node/{id}/relation', 'put'],
    ['delAd', '/npauth/v1/delete/{nodeId}/node/relation', 'delete'],
    ['getSelfOrg', '/npauth/v1/self/organizations', 'get'],
    ['checkAdIP', '/npauth/v1/node/relation/ip/check', 'post'],

    /* 组织机构 */
    ['allOrg', '/npauth/v1/organizations', 'get'], //查询所有组织机构
    ['pageOrg', '/npauth/v1/sort/list/child/orgs/{currentPage}/{pageSize}', 'get'], //分页查询组织机构
    ['addOrg', '/npauth/v1/organization', 'post'], //组织机构添加
    ['delOrg', '/npauth/v1/delete/organizations', 'post'], //删除组织机构
    ['editOrg', '/npauth/v1/organization/{id}', 'put'], //组织机构修改
    ['getOrg', '/npauth/v1/organization/{id}', 'get'], //查询组织机构
    ['checkOrgName', '/npauth/v1/org/name/check', 'post'], //查询名称是否重复
    ['checkOrgNo', '/npauth/v1/org/no/check', 'post'], //查询编号是否重复
    ['orderOrg', '/npauth/v1/common/adjust/orgs/sort', 'put'], //排序

    /* 角色 */
    ['allRole', '/npauth/v1/{type}/roles', 'get'], //查询所有角色
    ['pageRole', '/npauth/v1/{type}/roles/split/page/{currentPage}/{pageSize}', 'get'], //分页查询角色
    ['addRole', '/npauth/v1/role', 'post'], //添加角色
    ['delRole', '/npauth/v1/delete/roles', 'post'], //批量删除角色
    ['editRole', '/npauth/v1/role/{id}', 'put'], //编辑角色
    ['getRole', '/npauth/v1/role/{id}', 'get'], //查询角色
    ['checkRoleName', '/npauth/v1/role/name/check', 'post'], //查询名称是否重复
    ['checkRoleNo', '/npauth/v1/role/code/check', 'post'], //查询编号是否重复

    /* 用户 */
    ['allUser', '/npauth/v1/users', 'get'], //查询所有用户
    ['pageUser', '/npauth/v1/recursion/organization/users/{currentPage}/{pageSize}', 'get'], //分页查询组织下用户
    ['listUser', '/npauth/v1/organization/{id}/users', 'get'], //查询组织下所有用户
    ['addUser', '/npauth/v1/config/user', 'post'], //添加用户
    ['delUser', '/npauth/v1/delete/users', 'post'], //批量删除用户
    ['editUser', '/npauth/v1/config/user', 'put'], //编辑用户
    ['getUser', '/npauth/v1/user/{id}', 'get'], //查询用户
    ['checkUserName', '/npauth/v1/user/login/name/check', 'post'], //查询名称是否重复
    ['checkUserGbId', '/npauth/v1/user/gb/id/check', 'post'], //查询国标编号是否重复
    ['checkUserIdCardNo', '/npauth/v1/user/idcard/check', 'post'], //查询证件号是否重复

    /* 权限 */
    ['permitFunList', '/npauth/v1/systems/functions', 'get'], //功能权限列表
    ['permitUserFun', '/npauth/v1/users/{id}/function_permissions', 'get'], //用户的功能权限
    ['permitRoleFun', '/npauth/v1/roles/{id}/function_permissions', 'get'], //角色的功能权限
    ['permitRes', '/npconfig/v1/permission/{id}', 'get'], //资源权限查询(包含用户和角色)
    ['editRes', '/npconfig/v1/permission/v2/{id}', 'post'], //资源权限保存(包含用户和角色)
    ['editUserFun', '/npauth/v1/users/{id}/config/function_permissions', 'post'], //用户功能权限保存
    ['editRoleFun', '/npauth/v1/roles/{id}/config/function_permissions', 'post'], //角色功能权限保存

    /* 资源屏蔽 */
    ['pageShield', '/npconfig/v1/emergency/events', 'get'],  //查询所有屏蔽事件
    ['getShield', '/npconfig/v1/emergency/event/{id}', 'get'], //查询屏蔽事件
    ['addShield', '/npconfig/v1/emergency/event', 'post'], //添加屏蔽事件
    ['editShield', '/npconfig/v1/emergency/event/{id}', 'post'], //编辑屏蔽事件
    ['delShield', '/npconfig/v1/emergency/event/delete', 'post'], //删除屏蔽事件

    /* 节点信息 */
    ['getNode', '/npconfig/v1/nodes/self', 'get'], //获取节点信息
    ['setNode', '/npconfig/v1/nodes/self', 'post'], //修改节点信息
    ['nodeLicense', '/npconfig/v1/pvgplus/GetLicenseInfo', 'post'], //节点权限信息

    /* 节点上级 */
    ['pageParentNode', '/npconfig/v1/cascade/relations/leaders/{model}', 'get'], //上级分页列表
    ['addParentNode', '/npconfig/v1/cascade/relations/leader/{model}', 'post'], //添加向上同步配置
    ['delParentNode', '/npconfig/v1/cascade/relations/leader/{id}', 'get'], //删除向上同步配置
    ['editParentNode', '/npconfig/v1/cascade/relations/leader/{model}', 'post'], //编辑向上同步配置
    ['getParentNode', '/npconfig/v1/cascade/relations/config/{model}', 'get'], //获取上级节点信息
    ['connectParentNode', '/npconfig/v1/cascade/relations/remoteNodeId/{model}', 'get'], //验证上级是否存在

    /* 节点下级 */
    ['pageChildNode', '/npconfig/v1/cascade/relations/members/{model}', 'get'], //获取下级节点
    ['listChildChecked', '/npconfig/v1/cascade/relations/synchronized/{id}', 'get'], //获取已勾选的摄像机
    ['listChildGroup', '/npconfig/v1/cascade/relations/memberGroups/{id}', 'get'], //获取下级节点的分组
    ['listChildCamera', '/npconfig/v1/cascade/relations/resource/{relationId}', 'get'], //获取下级节点的摄像机
    ['saveRelationData', '/npconfig/v1/cascade/relations/synchronized/{id}', 'post'], //拉取向上同步的数据
    ['getNodeStatus', '/npconfig/v1/cascade/relations/relationStatus/{id}', 'get'], //获取上级节点信息
    ['delChildNode', '/npconfig/v1/cascade/relations/rejectMember/{id}', 'post'], //打回

    ['pageRelationUpdate', '/npconfig/v1/cascade/relations/changedResource/{id}', 'get'], //获取下级变更数据
    ['saveRelationUpdate', '/npconfig/v1/cascade/relations/synchronizedChange/{id}', 'post'], //保存下级变更数据

    /* 外部认证 */
    ['allOtherOS', '/npauth/v1/authServers', 'get'], //查询所有外部认证
    ['pageOtherOS', '/npauth/v1/authServers/{currentPage}/{pageSize}', 'get'], //分页查询外部认证
    ['addOtherOS', '/npauth/v1/authServer', 'post'], //添加外部认证
    ['delOtherOS', '/npauth/v1/delete/authServers', 'post'], //批量删除外部认证
    ['editOtherOS', '/npauth/v1/authServer/{id}', 'put'], //编辑外部认证
    ['getOtherOS', '/npauth/v1/authServer/{id}', 'get'], //查询外部认证

    /* 服务 */
    ['pageServer', '/npconfig/v1/servers', 'get'], //服务器分页列举
    ['listServerByType', '/npconfig/v1/servers/{type}', 'get'], //根据类型获取服务
    ['listPauComponent', '/npconfig/v1/pau/moduleinfo', 'get'], //获取PAU组件
    ['addServer', '/npconfig/v1/server', 'post'], //添加服务
    ['delServer', '/npconfig/v1/servers/batch_delete', 'post'], //批量删除服务
    ['editServer', '/npconfig/v1/server/{id}', 'post'], //编辑服务
    ['getServer', '/npconfig/v1/server/{id}', 'get'], //获取指定服务

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
    ['listGbChecked', '/npconfig/v1/gbCache/checked/{id}', 'get'], //获取已勾选的摄像机
    ['listGbGroup', '/npconfig/v1/gbCache/groups/{id}', 'get'], //获取下级节点的分组
    ['listGbCamera', '/npconfig/v1/gbCache/{platformId}', 'get'], //获取下级节点的摄像机
    ['saveGbData', '/npconfig/v1/gbCache/accept/{id}', 'post'], //拉取向上同步的数据
    ['delGbNode', '/npconfig/v1/gbCache/rejectMember/{id}', 'post'], //打回
    ['getCameraNumber4Gb', '/npconfig/v1/gbCache/cameraNumber/{id}', 'get'], //获取下级国标平台同步的摄像机数量

    ['pageGbRelationUpdate', '/npconfig/v1/gbCache/changed/{id}', 'get'], //获取下级变更数据
    ['saveGbRelationUpdate', '/npconfig/v1/gbCache/changedUpdate/{id}', 'post'], //保存下级变更数据

    /* 视频分组 */
    ['allGroup', '/npconfig/v1/groups', 'get'],
    ['pageGroup', '/npconfig/v1/groups/{id}', 'get'],
    ['addGroup', '/npconfig/v1/group', 'post'],
    ['delGroup', '/npconfig/v1/groups/delete', 'post'],
    ['editGroup', '/npconfig/v1/group/{id}', 'post'],
    ['getGroup', '/npconfig/v1/group/{id}', 'get'],
    ['orderGroup', '/npconfig/v1/common/adjust/groups/sort', 'put'], //排序
    ['checkGroupName', '/npconfig/v1/group/name/check', 'post'], //分组名称标示重复检查
    ['checkGroupCode', '/npconfig/v1/group/code/check', 'post'], //分组唯一标示重复检查

    /* 业务分组-虚拟组织 */
    ['allBusinessGroup', '/npconfig/v1/businessGroups', 'get'], //获取所有业务分组
    ['allVirtualGroup', '/npconfig/v1/virtualOrgs', 'get'], //获取所有虚拟组织
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
    ['pageEncoder', '/npconfig/v1/encoders/{id}', 'get'], //列举所有分组
    ['addEncoder', '/npconfig/v1/device/encoder', 'post'], //添加
    ['addEncoderList', '/npconfig/v1/device/encoders', 'post'], //批量添加
    ['getEncoder', '/npconfig/v1/device/encoder/{id}', 'get'], //获取指定编码设备
    ['checkDeviceGb', '/npconfig/v1/device/gb/check', 'post'], //设备国标编号是否重复

    /* 解码设备 */
    ['pageDecoder', '/npconfig/v1/decoders/{id}', 'get'], //列举所有分组
    ['addDecoder', '/npconfig/v1/device/decoder', 'post'], //添加
    ['addDecoderList', '/npconfig/v1/device/decoders', 'post'], //批量添加
    ['getDecoder', '/npconfig/v1/device/decoder/{id}', 'get'], //获取指定解码设备

    ['allPau', '/npconfig/v1/servers/pau', 'get'], //获取所有PAU
    ['sipPau', '/npconfig/v1/servers/sippau', 'get'], //获取所有国标PAU
    ['editCoder', '/npconfig/v1/device/{id}', 'post'], //编辑编码或解码设备
    ['delCoder', '/npconfig/v1/devices/delete', 'post'], //批量删除编码或解码设备

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
    ['getCameraCount', '/npconfig/v1/camera/count', 'get'], //节点内摄像机总数

    /* 监视器 */
    ['allMonitor', '/npconfig/v1/monitors', 'get'], //列举所有监视器
    ['pageMonitor', '/npconfig/v1/monitors/{id}', 'get'], //分页列举
    ['listMonitor', '/npconfig/v1/monitors/group/{id}', 'get'], //列举分组下所有
    ['delMonitor', '/npconfig/v1/monitors/delete', 'post'], //批量删除监视器
    ['editMonitor', '/npconfig/v1/monitor/{id}', 'post'], //编辑监视器
    ['getMonitor', '/npconfig/v1/monitor/{id}', 'get'], //获取指定监视器
    ['checkMonitorNo', '/npconfig/v1/monitor/monitorNo/check', 'post'], //查询监视器编号是否重复

    /* 通道 */
    ['listRealChannels', '/npconfig/v1/device/channel_info/{type}/{deviceId}', 'get'],  //获取实际通道
    ['listChannels', '/npconfig/v1/channels/device/{deviceId}', 'get'],  //设备下的通道信息
    ['delChannelById', '/npconfig/v1/codec/{id}', 'delete'], //删除通道
    
    /* 通道 - 编码器 */
    ['batchAddCameraChannel', '/npconfig/v1/cameras', 'post'],  //设备下批量添加摄像机(通道)
    ['batchAddCoderChannel', '/npconfig/v1/codecs', 'post'],  //设备下批量添加编解码(通道)
    ['delCameraChannel', '/npconfig/v1/camera/{id}', 'delete'], //删除摄像机(通道)

    ['checkCameraNo', '/npconfig/v1/camera/id/check', 'post'],  //摄像机唯一标识重复检查
    ['checkCameraChannelNo', '/npconfig/v1/camera/channelNo/check', 'post'], //摄像机通道号重复检查
    ['checkCameraGb', '/npconfig/v1/camera/gb/check', 'post'],  //摄像机国标重复检查

    /* 通道 - 解码器 */
    ['batchAddMonitorChannel', '/npconfig/v1/monitors', 'post'],    //设备下批量添加通道
    ['delMonitorChannel', '/npconfig/v1/monitor/{id}', 'delete'],   //删除监视器（通道）

    ['checkMonitorChannelNo', '/npconfig/v1/monitor/channelNo/check', 'post'], //监视器通道号重复检查
    ['checkMonitorGb', '/npconfig/v1/monitor/gb/check', 'post'], //监视器国标重复检查

    /* 编解码通道 */
    ['pageChannel', '/npconfig/v1/codecs/{id}', 'get'], //列举分组下所有
    ['delChannel', '/npconfig/v1/codecs/delete', 'post'], //批量删除编解码通道
    ['editChannel', '/npconfig/v1/codec/{id}', 'post'], //编辑编解码通道
    ['getChannel', '/npconfig/v1/codec/{id}', 'get'], //获取指定编解码通道

    /* 键盘 */
    ['allKbUser', '/npconfig/v1/keyboard/user/list', 'get'], //键盘用户列表
    ['pageKeyboard', '/npconfig/v1/keyboards', 'get'], //列举所有
    ['addKeyboard', '/npconfig/v1/keyboard', 'post'], //添加键盘
    ['delKeyboard', '/npconfig/v1/keyboards', 'post'], //删除键盘
    ['editKeyboard', '/npconfig/v1/keyboard/{id}', 'put'], //编辑键盘
    ['getKeyboard', '/npconfig/v1/keyboard/{id}', 'get'], //获取指定键盘
    ['checkKbName', '/npconfig/v1/keyboard/name/check', 'post'], //键盘名称重复检查

    /* 录像模板 */
    ['allVideoTpl', '/npconfig/v1/videoPlanTemplates', 'get'], //列举所有
    ['pageVideoTpl', '/npconfig/v1/videoPlanTemplates', 'get'], //分页列举所有
    ['addVideoTpl', '/npconfig/v1/videoPlanTemplate', 'post'], //添加录像模板
    ['delVideoTpl', '/npconfig/v1/videoPlanTemplates/batch_delete', 'post'], //删除录像模板
    ['editVideoTpl', '/npconfig/v1/videoPlanTemplate/{id}', 'put'], //编辑录像模板
    ['getVideoTpl', '/npconfig/v1/videoPlanTemplate/{id}', 'get'], //获取录像模板

    ['batchVideoPlan', '/npconfig/v1/videoplan', 'post'], //批量编辑录像计划 (摄像机列表页面)
    ['getVideoPlan', '/npconfig/v1/videoplan/{id}', 'get'], //获取录像计划 (摄像机列表页面)
    ['editVideoPlan', '/npconfig/v1/videoplan/{id}', 'put'], //编辑录像计划 (摄像机列表页面)

    /* 模板信息 */
    ['tplInfo', '/{system}/v1/{name}/template/info', 'get'],

    /*------------------------------以下为 IOD 接口--------------------------------*/

    /* 原 wonder 服务-iod 接口 （如果没用，可自行删除） */
    ['allocateRes', '/npconfig/v1/iod/resourceAllocation/add', 'post'], //分配资源
    ['getMonitorByAttr', '/npconfig/v1/iod/resourceAllocation/getMonitorByIdAndType', 'get'], //获取已分配卡口资源列表
    ['getDeviceById', '/npconfig/v1/iod/resourceAllocation/getDeviceById', 'get'], //获取已分配相机资源列表
    ['getTerminalById', '/npconfig/v1/iod/resourceAllocation/getTerminalById', 'get'], //获取已分配主机资源列表
    ['getVirtualMonitorById', '/npconfig/v1/iod/resourceAllocation/getVirtualMonitorById', 'get'], //获取已分配微卡口资源列表
    ['getAllRoadMonitor', '/npconfig/v1/iod/roadMonitor/listForResource', 'get'], //获取所有卡口及微卡口资源
    ['getAllDevice', '/npconfig/v1/iod/device/listForResource', 'get'], //获取所有相机资源
    ['getAllHost', '/npconfig/v1/iod/terminal/listForResource', 'get'], //获取所有主机资源
    ['updateTime', '/npconfig/v1/iod/accessServer/updateTime', 'get'], //校时
    ['endCmd', '/npconfig/v1/iod/accessServer/endCmd', 'get'], //停止
    ['startCmd', '/npconfig/v1/iod/accessServer/startCmd', 'get'], //启动
    ['getAllState', '/npconfig/v1/iod/accessServer/getStateAll', 'get'], //获取所有接入代理服务状态

    /* 服务-iod */
    ['getKafkaList', '/npconfig/v2/iod/kafkaServices', 'get'],   //获取Kafka列表
    ['addKafka', '/npconfig/v2/iod/kafkaService', 'post'],   //添加Kafka
    ['editKafka', '/npconfig/v2/iod/kafkaService/{id}', 'put'],   //修改Kafka
    ['getKafka', '/npconfig/v2/iod/kafkaService/{id}', 'get'],   //获取Kafka
    ['deleteKafka', '/npconfig/v2/iod/kafkaService/{id}', 'delete'],   //删除Kafka单条
    ['deleteKafkas', '/npconfig/v2/iod/kafkaServices/delete', 'post'],   //批量删除Kafka

    ['getPccList', '/npconfig/v2/iod/pccServices', 'get'],   //获取Pcc列表
    ['addPcc', '/npconfig/v2/iod/pccService', 'post'],   //添加Pcc
    ['editPcc', '/npconfig/v2/iod/pccService/{id}', 'put'],   //修改Pcc
    ['getPcc', '/npconfig/v2/iod/pccService/{id}', 'get'],   //获取Pcc
    ['deletePcc', '/npconfig/v2/iod/pccService/{id}', 'delete'],   //删除Pcc单条
    ['deletePccs', '/npconfig/v2/iod/pccServices/delete', 'post'],   //批量删除Pcc

    ['getBimgList', '/npconfig/v2/iod/bimgServices', 'get'],   //获取Bimg列表
    ['addBimg', '/npconfig/v2/iod/bimgService', 'post'],   //添加Bimg
    ['editBimg', '/npconfig/v2/iod/bimgService/{id}', 'put'],   //修改Bimg
    ['getBimg', '/npconfig/v2/iod/bimgService/{id}', 'get'],   //获取Bimg
    ['deleteBimg', '/npconfig/v2/iod/bimgService/{id}', 'delete'],   //删除Bimg单条
    ['deleteBimgs', '/npconfig/v2/iod/bimgServices/delete', 'post'],   //批量删除Bimg

    ['getExchangeList', '/npconfig/v2/iod/exchangeServices', 'get'],   //获取Exchange列表
    ['addExchange', '/npconfig/v2/iod/exchangeService', 'post'],   //添加Exchange
    ['editExchange', '/npconfig/v2/iod/exchangeService/{id}', 'put'],   //修改Exchange
    ['getExchange', '/npconfig/v2/iod/exchangeService/{id}', 'get'],   //获取Exchange
    ['deleteExchange', '/npconfig/v2/iod/exchangeService/{id}', 'delete'],   //删除Exchange单条
    ['deleteExchanges', '/npconfig/v2/iod/exchangeServices/delete', 'post'],   //批量删除Exchange

    ['getCms', '/npconfig/v2/iod/cmsService', 'get'],   //获取Cms
    ['editCms', '/npconfig/v2/iod/cmsService/{id}', 'put'],   //修改Cms
    ['addCms', '/npconfig/v2/iod/cmsService', 'post'],   //添加Cms
    ['deleteCms', '/npconfig/v2/iod/cmsService/{id}', 'delete'],   //删除Cms单条

    ['getRecognitionList', '/npconfig/v2/iod/recognitionServices', 'get'],   //获取Recognition列表
    ['addRecognition', '/npconfig/v2/iod/recognitionService', 'post'],   //添加Recognition
    ['editRecognition', '/npconfig/v2/iod/recognitionService/{id}', 'put'],   //修改Recognition
    ['getRecognition', '/npconfig/v2/iod/recognitionService/{id}', 'get'],   //获取Recognition
    ['deleteRecognition', '/npconfig/v2/iod/recognitionService/{id}', 'delete'],   //删除Recognition单条
    ['deleteRecognitions', '/npconfig/v2/iod/recognitionServices/delete', 'post'],   //批量删除Recognition

    ['getOutputList', '/npconfig/v2/iod/outputServices', 'get'],   //获取Output列表
    ['addOutput', '/npconfig/v2/iod/outputService', 'post'],   //添加Output
    ['editOutput', '/npconfig/v2/iod/outputService/{id}', 'put'],   //修改Output
    ['getOutput', '/npconfig/v2/iod/outputService/{id}', 'get'],   //获取Output
    ['deleteOutput', '/npconfig/v2/iod/outputService/{id}', 'delete'],   //删除Output单条
    ['deleteOutputs', '/npconfig/v2/iod/outputServices/delete', 'post'],   //批量删除Output
    
    ['checkIpPortRepeat', '/npconfig/v2/iod/check', 'get'],

    ['getAccessList', '/npconfig/v2/iod/accessServices', 'get'],   //获取Access列表
    ['addAccess', '/npconfig/v2/iod/accessService', 'post'],   //添加Access
    ['editAccess', '/npconfig/v2/iod/accessService/{id}', 'put'],   //修改Access
    ['getAccess', '/npconfig/v2/iod/accessService/{id}', 'get'],   //获取Access
    ['deleteAccess', '/npconfig/v2/iod/accessService/{id}', 'delete'],   //删除Access单条
    ['deleteAccesss', '/npconfig/v2/iod/accessServices/delete', 'post'],   //批量删除Access
    // 接入服务 分配资源
    ['getAccessGroup', '/npconfig/v2/iod/groups/accessService/{id}', 'get'], // 获取分组
    ['getAccessResources', '/npconfig/v2/iod/resources', 'get'], // 获取资源
    ['getAccessAlloted', '/npconfig/v2/iod/resources/accessService/{id}', 'get'],  // 获取已分配的资源
    ['setAccessRes', '/npconfig/v2/iod/resourceAllot', 'post'],  // 分配资源
    // 接出服务 分配资源
    ['getOutputGroup', '/npconfig/v2/iod/groups/outputService/{id}', 'get'], // 获取分组
    ['getOutputResources', '/npconfig/v2/iod/outputService/resources', 'get'], // 获取资源
    ['getOutputAlloted', '/npconfig/v2/iod/resources/outputService/{id}', 'get'], // 获取已分配的资源
    ['setOutputRes', '/npconfig/v2/iod/outputResourceAllot', 'post'],  // 分配资源

    //分组
    ['getRootGroup', '/npconfig/v2/iod/trees/organ', 'get'], //获取分组树的根
    ['getTreeGroup', '/npconfig/v2/iod/trees/organ/{id}', 'get'], //获取分组树
    ['getGroupList', '/npconfig/v2/iod/organs/{id}', 'get'], //获取分组列表
    // TODO 和PVM接口重复请改名
    //['getGroup', '/npconfig/v2/iod/organ/{id}', 'get'],   //获取Group
    //['addGroup', '/npconfig/v2/iod/organ', 'post'],   //添加Group
    //['editGroup', '/npconfig/v2/iod/organ/{id}', 'put'],   //修改Group
    ['deleteGroup', '/npconfig/v2/iod/organ/{id}', 'delete'],   //删除Group单条
    ['deleteGroups', '/npconfig/v2/iod/organs/delete', 'post'],   //批量删除Group

    //设备
    ['getDeviceList', '/npconfig/v2/iod/equipments/group/{id}', 'get'], //获取Device列表
    ['addDevice', '/npconfig/v2/iod/equipment', 'post'],   //添加Device
    ['editDevice', '/npconfig/v2/iod/equipment/{id}', 'put'],   //修改Device
    ['getDevice', '/npconfig/v2/iod/equipment/{id}', 'get'],   //获取Device
    ['deleteDevice', '/npconfig/v2/iod/equipment/{id}', 'delete'],   //删除Device单条
    ['deleteDevices', '/npconfig/v2/iod/equipments/delete', 'post'],   //批量删除Device
    //TODO 此处接口有问题
    ['getPauList', '/npconfig/v1/servers/pau,sippau', 'get'],   //获取PAU列表

    ['getHostList', '/npconfig/v2/iod/terminal/group/{id}', 'get'], //获取Host列表

    //卡口
    /*   ['getTollgateList', '/npconfig/v2/iod/tollgates/group/{id}', 'get'], //获取Tollgate列表 */
    ['getTollgateList', '/npconfig/v2/iod/tollgates', 'get'], //获取Tollgate列表
    ['addTollgate', '/npconfig/v2/iod/tollgate', 'post'],   //添加Tollgate
    ['editTollgate', '/npconfig/v2/iod/tollgate/{id}', 'put'],   //修改Tollgate
    ['getTollgate', '/npconfig/v2/iod/tollgate/{id}', 'get'],   //获取Tollgate
    ['deleteTollgate', '/npconfig/v2/iod/tollgate/{id}', 'delete'],   //删除Tollgate单条
    ['deleteTollgates', '/npconfig/v2/iod/tollgates/delete', 'post'],   //批量删除Tollgate

    ['getCameraList', '/npconfig/v2/iod/tollgate/cameras/virtual', 'get'], //获取Camera列表

    //车道
    ['getLanesList', '/npconfig/v2/iod/lanes/tollgate/{id}', 'get'], //获取Lanes列表
    ['addLane', '/npconfig/v2/iod/lane', 'post'],   //添加Lane
    ['editLane', '/npconfig/v2/iod/lane/{id}', 'put'],   //修改Lane
    ['getLane', '/npconfig/v2/iod/lane/{id}', 'get'],   //获取Lane
    ['deleteLane', '/npconfig/v2/iod/lane/{id}', 'delete'],   //删除Lane
    ['deleteLanes', '/npconfig/v2/iod/lanes/delete', 'post'],   //批量删除

    ['getDeviceList4Group', '/npconfig/v2/iod/cameras/group/{id}', 'get'], //通过分组ID获取设备列表

    //导入导出
    ['queryTemplate', '/npconfig/v2/iod/import/{userId}/status', 'get'],   //查询任务状态

    //厂商
    ['getManufacturerList', '/npconfig/v2/iod/manufacturers', 'get'], //获取Manufacturer列表
    ['addManufacturer', '/npconfig/v2/iod/manufacturer', 'post'],   //添加Manufacturer
    ['editManufacturer', '/npconfig/v2/iod/manufacturer/{id}', 'put'],   //修改Manufacturer
    ['getManufacturer', '/npconfig/v2/iod/manufacturer/{id}', 'get'],   //获取Manufacturer
    ['deleteManufacturer', '/npconfig/v2/iod/manufacturer/{id}', 'delete'],   //删除Manufacturer单条
    ['deleteManufacturers', '/npconfig/v2/iod/manufacturers/delete', 'post'],   //批量删除Manufacturer

    //字段管理
    ['getFieldsList', '/npconfig/v2/iod/fields', 'get'], //获取字段列表
    ['editField', '/npconfig/v2/iod/fields', 'post'],   //修改字段
    ['deleteField', '/npconfig/v2/iod/field/{id}', 'delete'],   //删除单条字段

    //映射管理
    ['getMapsList', '/npconfig/v2/iod/fieldMappings/manufacturer/{id}', 'get'], //获取映射列表
    ['getMapsList4Item', '/npconfig/v2/iod/fieldItemMappings/manufacturer/{id}', 'get'], //获取映射列表带search
    ['editMap', '/npconfig/v2/iod/fieldMappings', 'post'],   //修改映射

    ['getMapsList4Dict', '/npconfig/v2/iod/fieldItemMappings/fieldMapping/{id}', 'get'], //根据字段映射ID获取字典项映射信息
    ['editMapsDict', '/npconfig/v2/iod/fieldItemMappings', 'post'], //修改字典映射

    //字典管理
    ['getDictItemList', '/npconfig/v2/iod/fieldItems/field/{id}', 'get'], //获取字典项
    ['getDictItemList4Search', '/npconfig/v2/iod/fieldItems', 'get'], //获取字典项(带search)
    ['editDict', '/npconfig/v2/iod/fieldItems', 'post'], //修改字典
    ['deleteDict', '/npconfig/v2/iod/fieldItem/{id}', 'delete'], //删除单条字典

    //常量
    ['getConstsList', '/npconfig/v2/iod/constants', 'get'],   //获取常量

    //平台管理
    ['getTerraceList', '/npconfig/v2/iod/terraces', 'get'], //获取Terrace列表
    ['addTerrace', '/npconfig/v2/iod/terrace', 'post'],   //添加Terrace
    ['editTerrace', '/npconfig/v2/iod/terrace/{id}', 'put'],   //修改Terrace
    ['getTerrace', '/npconfig/v2/iod/terrace/{id}', 'get'],   //获取Terrace
    ['deleteTerrace', '/npconfig/v2/iod/terrace/{id}', 'delete'],   //删除Terrace单条
    ['deleteTerraces', '/npconfig/v2/iod/terraces/delete', 'post'],   //批量删除Terrace
    ['getTerrace4v1', '/npconfig/v2/iod/sync/pull/terrace/{id}', 'get']   //拉取Terrace数据

    //卡口分组
    //['getRmgTree', '/npconfig/v1/iod/org/children', 'get'],
    //['listGroupOpt', '/npconfig/v1/iod/org/listAll', 'get'],
    //['listRmg', '/npconfig/v1/iod/org/childrenList', 'get'],
    //['addRmg', '/npconfig/v1/iod/org/add', 'post'],
    //['updateRmg', '/npconfig/v1/iod/org/update', 'post'],
    //['delRmg', '/npconfig/v1/iod/org/delete', 'post'],
    //['syncData', '/npconfig/v1/iod/roadMonitor/refresh/{orgId}', 'post'],
    // //同步数据

    //卡口管理
    //['listRm', '/npconfig/v1/iod/roadMonitor/list', 'get'],
    //['addRm', '/npconfig/v1/iod/roadMonitor/save', 'post'],
    //['updateRm', '/npconfig/v1/iod/roadMonitor/update', 'post']
    //['delRm', '/npconfig/v1/iod/roadMonitor/batchDelete', 'post'],
    //['listCameraRm', '/npconfig/v1/cameras/roadmonitor', 'get'], //列举所有卡口摄像机

    //主机管理
    //['listHost', '/npconfig/v1/iod/terminal/list', 'get'],
    //['addHost', '/npconfig/v1/iod/terminal/add', 'post'],
    //['updateHost', '/npconfig/v1/iod/terminal/update', 'post'],
    //['delHost', '/npconfig/v1/iod/terminal/delete', 'post']

    //相机管理
    //['listRmc', '/npconfig/v1/iod/device/devices', 'get'],
    //['addRmc', '/npconfig/v1/iod/device/add', 'post'],
    //['updateRmc', '/npconfig/v1/iod/device/update', 'post'],
    //['delRmc', '/npconfig/v1/iod/device/delete', 'post'],

    //车道管理
    //['listLane', '/npconfig/v1/iod/channel/channels', 'get'],
    //['addLane', '/npconfig/v1/iod/channel/add', 'post'],
    //['updateLane', '/npconfig/v1/iod/channel/update', 'post'],
    //['delLane', '/npconfig/v1/iod/channel/delete', 'post'],

    //字典管理
    //['getNetPosaDict', '/npconfig/v1/iod/dictionary/list', 'get'],
    //['getManufacturerDict', '/npconfig/v1/iod/accessMapping/accessMappings',
    // 'get'], ['getManufacturerCol',
    // '/npconfig/v1/iod/fieldTransform/mapById', 'get'], ['saveDict',
    // '/npconfig/v1/iod/dictionary/merge', 'post'], ['saveOtherDict',
    // '/npconfig/v1/iod/accessMapping/add', 'post'], ['delDict',
    // '/npconfig/v1/iod/dictionary/batchDelete', 'post'], ['saveCol',
    // '/npconfig/v1/iod/fieldTransform/add', 'post']
  ].map(function (v) {
    v[1] = prefix + v[1]
    if (v[2] === 'post' || v[2] === 'put') {
      v[3] = v[3] || 'text/plain'
    }
    return v
  })
}

module.exports = listService
