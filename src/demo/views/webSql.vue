<template>
  <div class="sql">
    <div class="msg">MESSAGE:({{result.code}})-------->{{result.message}}</div>
    <el-button @click="initData">生成数据</el-button>
    <el-button @click="query">调用数据</el-button>
    <el-button @click="drop">删除表结构</el-button>
    <ul style="margin-top: 20px">
      <li v-for="item in list">
        <span style="display:inline-block;width: 180px">UUID: [{{item.uuid}}]</span>
        ----------->
        <span style="padding-left: 20px">Name: [{{item.name}}]</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { TreeCache, transaction } from '@/util/sql'
import { roll, random16 } from '@/util/core'

export default {
  data () {
    return {
      list: [],
      result: {},
      currentPage: 1
    }
  },
  methods: {
    drop () {
      transaction((context) => {
        this.DB.drop(context)
      }, () => {
        this.result = {
          code: 200,
          message: '表结构删除成功'
        }
      })
    },
    query () {
      let { DB } = this
      let ids = [roll(), roll(), roll(), roll()]
      transaction((context) => {
        DB.query(context, ids, (rst) => this.list = rst)
      })
    },
    initData () {
      let { DB } = this
      let data = []

      for (let i = 0; i < 10000; i++) {
        data.push({
          id: i,
          uuid: random16(16),
          name: `摄像机/${i}`
        })
      }

      transaction((context) => {
        DB.insert(context, data).catch((e) => {
          this.result = {
            code: 301,
            message: e.message
          }
        })
      }, () => {
        if (this.result.code !== 301) {
          this.result = {
            code: 200,
            message: `${data.length}条数据被初始化`
          }
        }
      })
    }
  },
  mounted () {
    transaction((context) => {
      this.DB = new TreeCache(context, {
        id: 'INTEGER UNIQUE', uuid: 'UNIQUE', name: 'TEXT'
      })
    })
  }
}
</script>

<style lang="less">
  .sql {
    .msg {
      padding: 10px 5px 20px;
      font-size: 16px;
    }

    li {
      padding: 5px 0;
    }
  }
</style>
