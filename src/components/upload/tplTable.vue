<template>
  <div class="tc tpl">
    <div class="jt jp">
      <div class='jb'>
        <div class='jb-h'>
          <table :width="tableWidth">
            <colgroup>
              <col :width="col[1]" v-for='col in colVis'>
            </colgroup>
            <thead>
            <tr>
              <th v-for='col in colVis'>
                <span class="ellipsis"
                      :class="{'text-right': column[col[0]].btnCol}">
                  {{column[col[0]].name}}
                </span>
                <div class="drag"
                     v-if="column[col[0]].drag !== !1 && !column[col[0]].btnCol"
                     v-drag="col"></div>
              </th>
            </tr>
            </thead>
          </table>
        </div>
        <div class='jb-c' v-if="list.length > 0">
          <table :width="tableWidth">
            <colgroup>
              <col :width="col[1]" v-for='col in colVis'>
            </colgroup>
            <tbody class="no-line">
            <tr v-for='(node, index) in list'>
              <td v-for='col in colVis' :class="column[col[0]].id">
                <div class="ellipsis">{{node[column[col[0]].id]}}</div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="loading-content" v-loading="!0" v-else></div>
      </div>
      <div class="jl">
        <table width="100%">
          <thead>
          <tr>
            <th></th>
          </tr>
          </thead>
        </table>
        <table width="100%">
          <tbody>
          <tr v-for='(node, index) in list'>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'tpl-table',
  data () {
    return {
      list: [],
      column: [],
      colVis: []
    }
  },
  props: {
    name: String,
    system: String
  },
  directives: {
    drag: {
      bind (el, binding) {
        let data = {
          width: 0,
          x: 0,
          y: 0
        }
        let move = (e) => {
          let width = data.width + e.pageX - data.x
          if (width > 100 && width < 400) {
            binding.value.splice(1, 1, width)
          }
        }
        let up = () => {
          window.removeEventListener('mousemove', move)
          window.removeEventListener('mouseup', up)
        }

        el.addEventListener('mousedown', function (e) {
          e.stopPropagation()
          e.preventDefault()

          data.width = binding.value[1]
          Object.assign(data, {
            left: e.target.offsetLeft,
            x: e.pageX
          })

          window.addEventListener('mousemove', move)
          window.addEventListener('mouseup', up)
        })
      }
    }
  },
  computed: {
    tableWidth () {
      let width = 0
      if (this.colVis) {
        this.colVis.forEach((obj) => {
          width += obj[1]
        })
      } else {
        width = '100%'
      }
      return $.isNumeric(width) ? width : '100%'
    }
  },
  mounted () {
    let tw = $(window).width() - 364
    Service.tplInfo({
      system: this.system,
      name: this.name
    }).then((r) => {
      let list = r.data.list
      $.each(list, (i, tr) => {
        if (i === 0) {
          let width = 150
          let flag = !1
          if (tr.length * 150 <= tw) {
            flag = !0
            width = $.int((tw / tr.length).toFixed())
          }
          let rw = width * tr.length
          $.each(tr, (j, td) => {
            this.column.push({
              id: 'col-' + j,
              name: td
            })
            this.colVis.push([j, (flag && j === 0) ? width - rw + tw - 1 : width])
          })
        } else {
          let obj = {}
          this.list.push(obj)
          $.each(tr, (j, td) => {
            obj['col-' + j] = td
          })
        }
      })
    })
  }
}
</script>
<style lang="less">
  .tpl {
    position: static !important;

    &:hover .jt .jb {
      overflow-x: auto;
    }

    .jt {
      .jb {
        height: 260px;
        overflow-x: hidden;

        .loading-content {
          width: 100%;
          height: 100%;
        }
      }

      .jl table th {
        background-color: #fafafa;
      }
    }
  }
</style>
