import final from '@/data/final.js'

/**
 * 自定义时,必须初始化 handler
 * */

var log = function (conf) {
  this.handler = conf.handler //获取日志描述
  this.mod = conf.mod //模块
  this.type = conf.type //操作类型
  this.tpl = conf.tpl //模板
  this.form = conf.form //表单JSON(新值)(用于更新,删除和添加)
  this.list = conf.list //用于批量删除
  this.old = conf.old //原值 (只用于更新)
  this.attr = conf.attr //属性JSON, 更新比较
}

log.ARRAY = 'array'
log.JSON = 'json'

log.UPDATE = 'update'
log.DEL = 'del'
log.DEL_LIST = 'del-list'
log.ADD = 'add'
log.ADD_LIST = 'add-list'

log.NODE_INFO = 'f1201' //节点信息
log.SERVER = 'f1202' //服务器
log.NODE_RELATION = 'f1203' //节点关系
log.CASCADE = 'f1204' //平台关系
log.GROUP = 'f1205' //视频分组
log.ENCODE = 'f1206' //视频编码设备
log.DECODE = 'f1207' //视频解码设备
log.CAMERA = 'f1208' //摄像机
log.MONITOR = 'f1209' //监视器
log.CHANNEL = 'f1210' //编解码通道
log.KEYBOARD = 'f1211' //键盘
log.RMG = 'f1212' //卡口分组
log.RM = 'f1213' //卡口
log.HOST = 'f1214' //主机
log.RMCAMERA = 'f1215' //卡口相机
log.LANE = 'f1216' //车道
log.DICT = 'f1217' //字典
log.VIDEO_TPL = 'f1218' //录像模板

log.prototype.push = function (apiName) {
  this.mod = this.mod || ($.isFunction(modMap[apiName][0]) && modMap[apiName][0].call(this) || modMap[apiName][0])
  this.type = this.type || modMap[apiName][1]
  switch (this.type) {
    case log.UPDATE : {
      return ajax((this.handler || update).call(this), this.mod)
    }
    case log.DEL : {
      return ajax((this.handler || del).call(this), this.mod)
    }
    case log.DEL_LIST : {
      return ajax((this.handler || delList).call(this), this.mod)
    }
    case log.ADD : {
      return ajax((this.handler || add).call(this), this.mod)
    }
    case log.ADD_LIST : {
      return ajax((this.handler || addList).call(this), this.mod)
    }
    default : {
      return ajax(this.handler(), this.mod)
    }
  }
}

var modMap = {
  //节点信息
  setNode: [log.NODE_INFO, log.UPDATE],
  //节点关系
  applyCascade: [log.NODE_RELATION],
  cancelCascade: [log.NODE_RELATION],
  responseRequest: [log.NODE_RELATION],
  pullCascadeData: [log.NODE_RELATION],
  //服务器
  addServer: [log.SERVER],
  editServer: [log.SERVER],
  delServer: [log.SERVER],
  allocateRes: [log.SERVER],
  updateOutAgent: [log.SERVER],
  //平台关系
  addPlatform: [log.CASCADE],
  updatePlatform: [log.CASCADE],
  delPlatform: [log.CASCADE],
  addPlatform4plus: [log.CASCADE],
  updatePlatform4plus: [log.CASCADE],
  delPlatform4plus: [log.CASCADE],
  pullSyncData: [log.CASCADE],
  //视频分组
  addGroup: [log.GROUP, log.ADD],
  updateGroup: [log.GROUP, log.UPDATE],
  delGroup: [log.GROUP, log.DEL],
  delGroupList: [log.GROUP, log.DEL_LIST],
  //编码设备
  addEncoder: [log.ENCODE, log.ADD],
  addEncoderList: [log.ENCODE, log.ADD_LIST],
  //解码设备
  addDecoder: [log.DECODE, log.ADD],
  addDecoderList: [log.DECODE, log.ADD],
  //以下3个接口在ENCODE时需要设定mod属性
  editDevice: [log.DECODE, log.UPDATE],
  delDevice: [log.DECODE, log.DEL],
  delDeviceList: [log.DECODE, log.DEL_LIST],
  //摄像机
  editCamera: [log.CAMERA, log.UPDATE],
  delCamera: [log.CAMERA, log.DEL],
  delCameraList: [log.CAMERA, log.DEL_LIST],
  setVideoPlan: [log.CAMERA, log.ADD],
  editVideoPlan: [log.CAMERA, log.UPDATE],
  //监视器
  editMonitor: [log.MONITOR],
  delMonitor: [log.MONITOR],
  delMonitorList: [log.MONITOR],
  //编解码通道
  editChannel: [log.CHANNEL],
  delChannel: [log.CHANNEL],
  //键盘
  editKeyboard: [log.KEYBOARD],
  delKeyboard: [log.KEYBOARD],
  addKeyboard: [log.KEYBOARD],
  //卡口分组
  addRmg: [log.RMG, log.ADD],
  updateRmg: [log.RMG, log.UPDATE],
  delRmg: [log.RMG, log.DEL],
  syncData: [log.RMG],
  //卡口管理
  addRm: [log.RM, log.ADD],
  updateRm: [log.RM, log.UPDATE],
  delRm: [log.RM, log.DEL],
  //主机管理
  addHost: [log.HOST, log.ADD],
  updateHost: [log.HOST, log.UPDATE],
  delHost: [log.HOST, log.DEL],
  //相机管理
  addRmc: [log.RMCAMERA, log.ADD],
  updateRmc: [log.RMCAMERA, log.UPDATE],
  delRmc: [log.RMCAMERA, log.DEL],
  //车道管理
  addLane: [log.LANE, log.ADD],
  updateLane: [log.LANE, log.UPDATE],
  delLane: [log.LANE, log.DEL],
  //字典管理
  saveDict: [log.DICT],
  saveOtherDict: [log.DICT],
  delDict: [log.DICT],
  saveCol: [log.DICT],
  //录像模板
  editVideoTpl: [log.VIDEO_TPL, log.UPDATE],
  delVideoTpl: [log.VIDEO_TPL, log.DEL],
  addVideoTpl: [log.VIDEO_TPL, log.ADD]
}

var formatJSON = function (json) {
  if ($.isPlainObject(json)) {
    return json
  } else if ($.isArray(json)) {
    return json
  } else {
    return JSON.parse(json)
  }
}

var formatStr = function (value, list) {
  $.each(list, function (i, json) {
    for (var key in json) {
      if (value === key) {
        value = json[key]
      }
    }
  })
  return value
}

var updateJsonHandler = function (label, value, formValue) {
  if (JSON.stringify(formatJSON(value)) !== JSON.stringify(formatJSON(formValue))) {
    this.push($.tpl('【{{label}}】', {
      label: label
    }))
  }
}

var updateArrayHandler = function (label, value, formValue) {
  if (JSON.stringify(formatJSON(value)) !== JSON.stringify(formatJSON(formValue))) {
    this.push($.tpl('【{{label}}】', {
      label: label
    }))
  }
}

var updateStrHandler = function (label, value, formValue, conf, attr) {
  var mod = conf.mod,
      map = {},
      list
  
  map[log.CAMERA] = 'vdo_camera'
  map[log.RMCAMERA] = 'roadMonitor_camera'
  map[log.SERVER] = 'outerAgent'
  map[log.CASCADE] = 'platform'
  map[log.VIDEO_TPL] = 'tplVideo'
  
  list = map[mod] && final[map[mod]][attr.name] && final[map[mod]][attr.name].list || []
  
  if (value != formValue) {
    this.push($.tpl('【{{label}}: "{{value}}" -> "{{formValue}}"】', {
      label: label,
      value: formatStr(value, list),
      formValue: formatStr(formValue, list)
    }))
  }
}

var update = function () {
  var conf = this
  var msgList = []
  var list = $.isFunction(this.attr) ? this.attr() : this.attr
  var old = this.old
  var form = this.form
  
  $.each(list, function (i, attr) {
    var name = attr.name
    var label = attr.label
    var type = attr.type
    var handler = attr.handler
    if (type === log.ARRAY) {
      handler = handler || updateArrayHandler
    } else if (type === log.JSON) {
      handler = handler || updateJsonHandler
    } else {
      handler = handler || updateStrHandler
    }
    handler.call(msgList, label, old[name], form[name], conf, attr)
  })
  
  if (msgList.length > 0) {
    return '修改 ' + msgList.join(',')
  }
}

var del = function () {
  var tpl = this.tpl || '删除 【{{name}}】'
  return $.tpl(tpl, this.form)
}

var delList = function () {
  var tpl = this.tpl || ' 【{{name}}】 '
  return '批量删除 ' + $.tpl(tpl, this.list)
}

var addList = function () {
  var tpl = this.tpl || ' 【{{name}}】 '
  return '批量添加 ' + $.tpl(tpl, this.mod)
}

var add = function () {
  var tpl = this.tpl || '添加 【{{name}}】'
  return $.tpl(tpl, this.form)
}

var ajax = function (msg, mod) {
  console.log(msg, mod)
}

export default log
