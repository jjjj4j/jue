<template>
  <div class="video-limit">
    <el-form-item label="录像查询调阅限制">
      <el-select v-model="model.videoLimit.type" placeholder="请选择活动区域" :disabled="isMe()">
        <el-option :key="item.value"
                   :label="item.label"
                   :value="item.value"
                   v-for="item in option"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="limit" v-if="[1,2].indexOf(model.videoLimit.type) >= 0">
      <el-input placeholder="0"
                :disabled="isMe()"
                @blur="vldEvent"
                @change="vldEvent"
                v-model="model.videoLimit.d">
        <template slot="append">天</template>
      </el-input>
      <el-input placeholder="0"
                :disabled="isMe()"
                @blur="vlhEvent"
                @change="vlhEvent"
                v-model="model.videoLimit.h">
        <template slot="append">小时</template>
      </el-input>
      <el-input placeholder="0"
                :disabled="isMe()"
                @blur="vlmEvent"
                @change="vlmEvent"
                v-model="model.videoLimit.m">
        <template slot="append">分钟</template>
      </el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'video-limit',
  data () {
    return {
      option: [
        {
          label: '不限制',
          value: 0
        }, {
          label: '仅限定时间内可查询浏览',
          value: 1
        },
        {
          label: '仅限定时间外可查询浏览',
          value: 2
        }
      ]
    }
  },
  props: {
    model: Object
  },
  methods: {
    isMe () {
      return false
    },
    format (attr, v, min, max) {
      v = v.target ? v.target.value : v
      let _v_ = $.int(v)
      if (v !== _v_) {
        _v_ = _v_ || 0
      }
      if (_v_ < min) {
        _v_ = min
      } else if (max && _v_ > max) {
        _v_ = max
      }
      this.$nextTick(() => {
        this.model.videoLimit[attr] = _v_
      })
    },
    vldEvent (v) {
      this.format('d', v, 0)
    },
    vlhEvent (v) {
      this.format('h', v, 0, 23)
    },
    vlmEvent (v) {
      this.format('m', v, 0, 59)
    }
  }
}
</script>

<style lang="less">
  .video-limit {
    .limit {
      input {
        border: 0;
        text-align: center;
      }
      .el-input {
        width: 125px !important;
      }
      .el-form-item__content {
        width: 386px;
        border: 1px solid #bfcbd9;
      }
      .el-input-group__append {
        border: 0;
      }
    }
  }
</style>
