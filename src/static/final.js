import { protocol } from '@/util/protocol'

export const oNode = {
  status: {
    default: 'ask',
    list: [
      { 'ask': '未同步' },
      { 'partAccept': '部分同步' }, // 强制删除
      { 'allAccept': '全部同步' }, // 强制删除
      { 'reject': '拒绝' },
      { 'pushing': '数据推送中' }, // 不可删除
      { 'failed': '推送数据失败' }
    ]
  }
}
export const iNode = {
  status: {
    default: '0',
    list: [
      { 'ask': '未同步' },
      { 'allAccept': '全部同步' },
      { 'partAccept': '部分同步' },
      { 'accepting': '数据接收中' },
      { 'failed': '接收数据失败' },
      { 'changed': '数据变化' },
      { 'reject': '数据删除中' }
    ]
  }
}
export const user = {
  type: {
    default: 0,
    type: Number,
    list: [
      { 0: '普通用户' },
      { 1: '键盘用户' }
    ]
  },
  status: {
    default: 0,
    type: Number,
    list: [
      { 1: '启用' },
      { 0: '禁用' }
    ]
  },
  sex: {
    default: 0,
    type: Number,
    list: [
      { 1: '女' },
      { 0: '男' }
    ]
  },
  online: {
    default: 0,
    type: Number,
    list: [
      { 1: '在线' },
      { 0: '离线' }
    ]
  },
  permitRepeatLogin: {
    default: [],
    list: [
      { '1': '不允许重复登录' }
    ]
  }
}
export const shield = {
  isExecute: {
    default: 0,
    type: Number,
    list: [
      { 2: '未执行' },
      { 1: '执行中' },
      { 0: '已停止' }
    ]
  },
  recordFlag: {
    default: ['1'],
    list: [
      { '1': '永久屏蔽有效期内所录制的录像' }
    ]
  }
}
export const administrative = {
  type: {
    default: 1,
    type: Number,
    list: [
      { 1: '上级' },
      { 2: '下级' }
    ]
  },
  adminStatus: {
    default: [],
    list: [
      { 'adminStatus': '禁用下级admin用户' }
    ]
  },
  status: {
    default: '',
    list: [
      { 0: '建立中' },
      { 1: '更新中' },
      { 2: '正常' },
      { 3: '脱离中' },
      { 4: '已脱离' }
    ]
  }
}
export const camera = {
  storeType: { // 录像计划-存储方式
    default: 0,
    type: Number,
    list: [
      { 0: '单节点存储' },
      { 1: '集群存储' }
    ]
  },
  flow: { // 录像计划-取流
    default: 1,
    type: Number,
    list: [
      { 1: '前端取流' },
      { 0: '服务器取流' }
    ]
  },
  ptz: {
    default: 'yes',
    list: [
      { yes: '可控' },
      { no: '不可控' }
    ]
  },
  transport: {
    default: 'udp',
    list: [
      { udp: 'UDP' },
      { tcp_active: '主动TCP' },
      { tcp_passive: '被动TCP' }
    ]
  },
  dpi: {
    default: '',
    list: [
      { 'HD': '高清' },
      { 'SD': '标清' },
      { 'UHD': '超清' }
    ]
  },
  parental: { // 是否有子设备
    default: 0,
    type: Number,
    list: [
      { 1: '有' },
      { 0: '没有' }
    ]
  },
  safetyway: { // 信令安全模式
    default: 0,
    type: Number,
    list: [
      { 0: '不采用' },
      { 2: 'S/MIME签名方式' },
      { 3: 'S/MIME加密签名同时采用方式' },
      { 4: '数字摘要方式' }
    ]
  },
  secrecy: { // 保密属性
    default: 0,
    type: Number,
    list: [
      { 0: '不涉密' },
      { 1: '涉密' }
    ]
  },
  position: { // 摄像机位置类型扩展
    default: 9,
    type: Number,
    list: [
      { 1: '省际检查站' },
      { 2: '党政机关' },
      { 3: '车站码头' },
      { 4: '中心广场' },
      { 5: '体育场馆' },
      { 6: '商业中心' },
      { 7: '宗教场所' },
      { 8: '校园周边' },
      { 9: '治安复杂区域' },
      { 10: '交通干线' }
    ]
  },
  room: { // 摄像机安装位置室外、室内属性
    default: 1,
    type: Number,
    list: [
      { 1: '室外' },
      { 2: '室内' }
    ]
  },
  uses: { // 摄像机用途属性
    default: 1,
    type: Number,
    list: [
      { 1: '治安' },
      { 2: '交通' },
      { 3: '重点' }
    ]
  },
  supplylight: { // 摄像机补光属性
    default: 1,
    type: Number,
    list: [
      { 1: '无补光' },
      { 2: '红外补光' },
      { 3: '白光补光' }
    ]
  },
  direction: { // 摄像机监视方位属性
    default: 1,
    type: Number,
    list: [
      { 1: '东' },
      { 2: '西' },
      { 3: '南' },
      { 4: '北' },
      { 5: '东南' },
      { 6: '东北' },
      { 7: '西南' },
      { 8: '西北' }
    ]
  }
}
export const service = {
  loop: {
    default: ['1'],
    list: [
      { '1': '到结束时自动从头重新开始' }
    ]
  },
  multicast: {
    default: ['1'],
    list: [
      { '1': '支持组播' }
    ]
  }
}
export const encode = {
  protocol,
  useType: {
    default: 'camera',
    list: [
      { 'camera': '摄像机' },
      { 'codec': '编码通道' }
    ]
  },
  deviceProperty: {
    default: ['voiceTalk', 'alarm'],
    list: [
      { 'alarm': '报警' },
      { 'voiceTalk': '语音对讲' }
    ]
  }
}
export const decode = {
  useType: {
    default: 'monitor',
    list: [
      { 'monitor': '监视器' },
      { 'codec': '解码通道' }
    ]
  },
  deviceProperty: {
    default: ['decode'],
    list: [
      { 'decode': '解码' },
      { 'control': '拼控' }
    ]
  }
}
export const monitor = {
  dpi: {
    default: 'SD',
    list: [
      { 'SD': '标清' },
      { 'HD': '高清' },
      { 'UHD': '超高清' }
    ]
  }
}
export const keyboard = {
  type: {
    default: 'network',
    list: [
      { 'network': '网络' },
      { 'serial': '串口' }
    ]
  },
  protocol: {
    default: 'ABKeyboard',
    list: [
      { 'ABKeyboard': 'ABKeyboard' },
      { 'ADKeyboardMatrix': 'ADKeyboardMatrix' },
      { 'ADKeyboardPTZ': 'ADKeyboardPTZ' },
      { 'KeyBoard_COVONDMatrix': 'KeyBoard_COVONDMatrix' },
      { 'KeyBoard_COVONDPTZ': 'KeyBoard_COVONDPTZ' },
      { 'KeyBoard_HIK': 'KeyBoard_HIK' },
      { 'KeyBoard_HIK1000': 'KeyBoard_HIK1000' },
      { 'KeyBoard_HIK1100': 'KeyBoard_HIK1100' },
      { 'KeyBoard_MAX1000Matrix': 'KeyBoard_MAX1000Matrix' },
      { 'KeyBoard_MAX1000PTZ': 'KeyBoard_MAX1000PTZ' },
      { 'KeyBoard_MAX1000LoginPTZ': 'KeyBoard_MAX1000LoginPTZ' },
      { 'KeyBoard_MAX1000MatrixSwitch': 'KeyBoard_MAX1000MatrixSwitch' },
      { 'KeyBoard_MAX1000PTZSwitch': 'KeyBoard_MAX1000PTZSwitch' },
      { 'RD-530': 'RD-530' },
      { 'RD-530_AT200': 'RD-530_AT200' },
      { 'RD-530_YT': 'RD-530_YT' },
      { 'KB08': 'KB08' },
      { 'AT200-MC': 'AT200-MC' },
      { 'NULLDVR': 'NULLDVR' },
      { 'PowerOnKeyboard': 'PowerOnKeyboard' },
      { 'PowerOnKeyboard_OD': 'PowerOnKeyboard_OD' },
      { 'PearMainNetKB': 'PearMainNetKB' },
      { 'NetKB': 'NetKB' },
      { 'HoneyWellKeyBoard': 'HoneyWellKeyBoard' }
    ]
  },
  baudRate: {
    default: 300,
    type: Number,
    list: [
      { '300': '300' },
      { '600': '600' },
      { '1200': '1200' },
      { '2400': '2400' },
      { '4800': '4800' },
      { '9600': '9600' },
      { '19200': '19200' },
      { '38400': '38400' },
      { '43000': '43000' },
      { '56000': '56000' },
      { '115200': '301152000' }
    ]
  },
  dataBits: {
    default: 8,
    type: Number,
    list: [
      { '8': '8' },
      { '7': '7' },
      { '6': '6' },
      { '5': '5' },
      { '4': '4' }
    ]
  },
  oddEvenCheck: {
    default: 'odd',
    list: [
      { 'odd': '奇校验' },
      { 'even': '偶校验' },
      { 'tag': '标记' },
      { 'space': '空格' }
    ]
  },
  stopBit: {
    default: 1,
    type: Number,
    list: [
      { '1': '1' },
      { '1.5': '1.5' },
      { '2': '2' }
    ]
  },
  streamCtrl: {
    default: 'hardware',
    list: [
      { 'hardware': '硬件流控制' },
      { 'xon_xoff': 'XON-XOFF' }
    ]
  }
}
export const cascade = {
  access: {
    default: 'gb_registry',
    list: [
      { 'gb_registry': '国标上级' },
      { 'gb_platform': '国标下级' },
      { 'pvg5x': 'PVG5.11' },
      { 'pvg67': 'PVG6.71' }
    ]
  },
  directoryType: {
    default: 2,
    type: Number,
    list: [
      { 0: '按列表显示' },
      { 1: '按父设备ID节点显示' },
      { 2: '按行政区划节点显示' }
    ]
  },
  directoryProtocol: {
    default: 0,
    type: Number,
    list: [
      { 0: 'UDP' },
      { 1: 'TCP' }
    ]
  },
  type: {
    default: ['in', 'out'],
    list: [
      { 'out': '输出' },
      { 'in': '输入' }
    ]
  },
  subscribe: {
    default: ['subscribe'],
    list: [
      { 'subscribe': '订阅事件' }
    ]
  }
}
export const serviceType = {
  cms: '中心管理服务',
  fs: '媒体转发服务',
  ss: '视频存储服务',
  sipgateway: '国标网关服务',
  sippau: '国标设备接入服务',
  pau: '设备接入服务',
  pau511: 'pvg511接入服务',
  pau671: 'pvg671接入服务',
  wall: '电视墙服务',
  log: '日志服务/事件服务',
  sp: '集群存储代理服务',
  sc: '集群云存储',
  ts: '卡口服务',
  pcc: 'pcc',
  aps: '接入代理服务',
  ops: '接出代理服务'
}
