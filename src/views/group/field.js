import reg from '@/static/reg'
import { destroyCascadeValue } from '@/util/form'

export default function (me) {
  return [
    {
      tag: 'el-cascader',
      name: 'parentId',
      label: '上级分组',
      tip: '必填（通过下拉菜单选择）',
      rules: [
        reg.required
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'name',
      label: '分组名称',
      desc: '长度在 1 到 64 个字符',
      tip: '必填，1-64字符，支持中文、英文（大小写）、数字输入，不可与其他分组名称重复',
      rules: [
        reg.required,
        reg.str64,
        reg.remote({
          id: me.model.id,
          name: 'name',
          param: { parentId: destroyCascadeValue(me.model.parentId) },
          api: 'checkGroupName',
          msg: '分组已存在，请重新填写'
        })
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'code',
      label: '唯一标识',
      tip: '必填，1-11字符，支持数字输入，不可与其他分组编号重复',
      rules: [
        reg.int11,
        reg.remote({
          id: me.model.id,
          name: 'code',
          api: 'checkGroupCode',
          msg: '分组唯一标识已存在，请重新填写'
        })
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'mappingCode',
      label: '映射编号',
      tip: '物联网（DAU）接入使用此映射编号，仅接入摄像机无需填写',
      rules: [
        reg.name(1, 64)
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      name: 'areaCode',
      label: '行政区划',
      tip: 'GB/T 28181中的行政区划编号，国标联网时使用',
      rules: [
        reg.int64
      ],
      createFunction: 'formItem'
    },
    {
      tag: 'el-input',
      type: 'textarea',
      name: 'description',
      label: '备注',
      tip: '选填，最多128长度输入',
      rules: [
        reg.str128
      ],
      createFunction: 'formItem'
    }
  ]
}
