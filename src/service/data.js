var URL = {}, db = {}
db.parentNode = require('./entity/parentNode.json') // 上级节点
db.childNode = require('./entity/childNode.json') // 上级节点
db.otheros = require('./entity/otheros.json') // 外部认证
db.org = require('./entity/org.json') // 组织机构
db.role = require('./entity/role.json') // 用户
db.user = require('./entity/user.json') // 用户
db.permit = require('./entity/permit.json') // 权限
db.camera = require('./entity/camera.json') // 摄像机

db.kafka = require('./entity/kafka.json') // kafka
db.pcc = require('./entity/pcc.json') // pcc
db.bimg = require('./entity/bimg.json') // bimg
db.exchange = require('./entity/exchange.json') // exchange数据交换
db.recognition = require('./entity/recognition.json') // recognition数据交换
db.output = require('./entity/output.json') // 接出
db.access = require('./entity/access.json') // 接入
db.iodGroup = require('./entity/iodGroup.json') // 分组
db.device = require('./entity/device.json') // 设备
db.manufacturer = require('./entity/manufacturer.json') // 厂商
db.tollgate = require('./entity/tollgate.json') // 卡口
db.lanes = require('./entity/lanes.json') // 车道
db.export = require('./entity/export.json') // 导入导出
db.fields = require('./entity/fields.json') // 字段编辑
db.map = require('./entity/map.json') // 映射编辑
db.consts = require('./entity/consts.json') // 常量编辑

db.terrace = require('./entity/terrace.json') // 平台编辑

db.group = require('./entity/group.json') // 视频分组
db.regroup = require('./entity/regroup.json') // 业务分组
db.encoder = require('./entity/encoder.json')// 编码设备
db.decoder = require('./entity/decoder.json') // 解码设备
// db.roadMonitor = require('./entity/roadMonitor.json') // 卡口
// db.roadMonitorGroup = require('./entity/roadMonitorGroup.json') // 卡口分组
// db.resource4Aps = require('./entity/resource4Aps.json') // 接入代理资源分配
// db.host = require('./entity/host.json') // 主机管理
// db.lane = require('./entity/lane.json') // 车道管理
// db.laneCamera = require('./entity/laneCamera.json') // 相机管理
db.service = require('./entity/service.json') // 服务
db.keyboard = require('./entity/keyboard.json') // 键盘
db.monitor = require('./entity/monitor.json') // 监视器
// db.subNodes = require('./entity/subNodes.json') // 下级节点
// db.camreaNodes = require('./entity/cameraNodes.json') // 摄像机节点
// db.iodChildNode = require('./entity/iodChildNode.json') // 下级级联
// db.syncPVD = require('./entity/syncPVD.json') // 同步PVD
db.netposaDict = require('./entity/netposaDict.json') // netposa字典
db.manufacturerDict = require('./entity/manufacturerDict.json')// 其他厂商字典
db.manufacturerCol = require('./entity/manufacturerCol.json')// 其他厂商字段
db.codec = require('./entity/codec.json') // 编解码通道
db.videoTemplate = require('./entity/videoTemplate.json') // 录像模板
db.cascade = require('./entity/cascade.json') // 平台

db.ad = require('./entity/ad.json')
db.shield = require('./entity/shield.json') // 视频屏蔽
export default {URL: URL, db: db}
