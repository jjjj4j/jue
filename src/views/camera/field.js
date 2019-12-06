import reg from '@/static/reg'
import { extend, repeat } from '@/util/core'
import { isIE9 } from '@/util/browser'
import { each, map } from '@/util/array'
import { tpl } from '@/util/char'

export default function (me) {
  let list = [
    {
      tag: 'el-input',
      name: 'name',
      label: '名称',
      tip: '必填，1-64字符，支持中文、英文（大小写）、数字输入，不可与其他通道名称重复',
      rules: [
        reg.required,
        reg.str36
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'gbId',
      label: '国标编号',
      tip: '选填，填写摄像机国标编号，仅支持20位数字输入',
      rules: [
        reg.gbId
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'gbIdMap',
      label: '国标编号映射',
      rules: [
        reg.gbId
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'host',
      label: '所属设备地址',
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'chanNo',
      label: '通道号',
      tip: '摄像机在所属设备中的具体通道号，IPC为1，DVR/NVR设备则按照实际情况填写',
      rules: [
        reg.chanNo
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'videoFlowType',
      label: '录像查询路径',
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'chanParam',
      label: '通道参数',
      tip: '接入RTSP等特殊设备时，需要填写的特殊接入信息',
      rules: [
        reg.num128
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'ptz',
      label: '云台类型',
      tip: '选填（通过下拉菜单选择）',
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'cameraNo',
      label: '摄像机键盘编号',
      rules: [
        reg.int20
      ],
      data: {
        on: {
          blur (e) {
            let nodeCode = me.number
            let cameraMaxDigit = me.cameraMaxDigit
            let kbNum = e.target.value, value = ''
            let length = cameraMaxDigit - nodeCode.length
            let format = function (num) {
              num = num.slice(0, length)
              if (num.length < length) {
                num = repeat('0', length - num.length) + num
              }
              return num
            }

            if (cameraMaxDigit === 0) {
              value = kbNum
            } else if (length <= 0) {
              value = kbNum.slice(0, cameraMaxDigit)
            } else if (kbNum.slice(0, nodeCode.length) === nodeCode && nodeCode.length > 0) {
              if (kbNum.length > cameraMaxDigit) {
                value = kbNum.slice(0, cameraMaxDigit)
              } else {
                value = nodeCode + format(kbNum.slice(nodeCode.length, cameraMaxDigit))
              }
            } else {
              if (kbNum.length > cameraMaxDigit) {
                value = kbNum.slice(0, cameraMaxDigit)
              } else {
                value = kbNum
              }
            }

            // 保持和 render.js 中input事件延迟一致
            window.setTimeout(() => {
              me.model.cameraNo = value
            }, isIE9 ? 300 : 100)
          }
        },
        nativeOn: {
          click (e) {
            let number = me.number
            let value = e.target.value
            if (number && !value) {
              me.model.cameraNo = number

              /* 将光标移动到文字最后 */
              if (isIE9) {
                let $input = e.target
                let range = $input.createTextRange()
                range.moveStart('character', number.length) // 设置开头的位置
                range.collapse()
                range.select()
              }
            }
          }
        }
      },
      tip () {
        let list = []
        let tip = '选填，填写键盘控制摄像机时的摄像机编号'
        if (!me.number) {
          list.push('节点编号未填写，请先在我的节点中填写节点编号')
        }
        if (me.cameraMaxDigit === 0) {
          list.push('摄像机编号总长度未填写，请先在CMS服务中填写摄像机编号总长度')
        } else {
          if (me.cameraMaxDigit <= me.number.length) {
            list.push('节点编号长度大于摄像机编号总长度，请在CMS服务中修改摄像机编号总长度')
          }
        }
        if (list.length > 0) {
          if (list.length === 1) {
            tip = '警告：' + list[0]
          } else {
            tip = map(list, (text, i) => {
              return tpl('{index}.{text}。', {
                index: (i === 0 ? '警告  ' : '') + (i + 1),
                text
              })
            })
          }
        }
        return tip
      },
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'longitude',
      label: '经度',
      tip: '选填，输入-180-180，最大精确到小数点后16位，摄像机经度位置',
      rules: [
        reg.longitude
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'latitude',
      label: '纬度',
      tip: '选填，输入-90-90，最大精确到小数点后16位，摄像机纬度位置',
      rules: [
        reg.latitude
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'transport',
      label: '国标流传输方式',
      tip: '选择国标对接时流的传输方式',
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'dpi',
      label: '分辨率',
      createFunction: 'formItem'
    },
    {
      tag: 'el-cascader',
      name: 'groupId',
      label: '所属分组',
      rules: [
        reg.required
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'manufacturer',
      label: '设备厂商',
      rules: [
        reg.str100
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'model',
      label: '设备型号',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'owner',
      label: '设备归属',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'block',
      label: '警区',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'address',
      label: '安装地址',
      rules: [
        reg.str64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'parental',
      label: '是否有子设备',
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'safetyway',
      label: '信令安全模式',
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'secrecy',
      label: '保密属性',
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'position',
      label: '摄像机位置类型扩展',
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'room',
      label: '摄像机安装位置',
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'uses',
      label: '摄像机用途',
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'supplylight',
      label: '摄像机补光',
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'angle',
      label: '摄像机照射角度',
      default: 60,
      rules: [
        reg.angle
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'radius',
      label: '摄像机照射半径',
      rules: [
        reg.int64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-select',
      name: 'direction',
      label: '摄像机监视方位',
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'mac',
      label: 'mac地址',
      rules: [
        reg.macAddr
      ],
      createFunction: 'formItem'
    }
  ]
  let type = me.model.type
  let disabled = {
    data: {
      props: {
        disabled: !0
      }
    }
  }

  return each(list, (attr) => {
    switch (type) {
      case 'sync' : {
        extend(true, attr, disabled)
        break
      }
      case 'share' : {
        if (['groupId', 'routChecked', 'gbIdMap', 'videoFlowType'].indexOf(attr.name) < 0) {
          extend(true, attr, disabled)
        }
        break
      }
      default : {
        if (['host'].indexOf(attr.name) >= 0) {
          extend(true, attr, disabled)
        }
      }
    }
  })
}
