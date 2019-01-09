<template>
  <div class="ajax">Text: {{text}}</div>
</template>

<script>
import { chain } from '@/util/ajax'
import Timer from '@/util/Timer'

export default {
  data () {
    return {
      text: '0'
    }
  },
  mounted () {
    chain(
      [
        (rst) => new Promise((resolve, reject) => {
          Timer('3', () => {
            resolve(rst.push('3') && rst)
            this.text = rst.join()
          })
        }),
        (rst) => new Promise((resolve, reject) => {
          Timer('4', () => {
            resolve(rst.push('4') && rst)
            this.text = rst.join()
          })
        }),
        (rst) => new Promise((resolve, reject) => {
          Timer('5', () => {
            reject(rst.push('5') && rst)
          })
        })
      ],
      new Promise((resolve, reject) => {
        Timer('1', () => {
          resolve('1')
        })
      }),
      new Promise((resolve, reject) => {
        Timer('2', () => {
          resolve('2')
        })
      })
    ).then((rst) => {
      this.text = rst.join()
    }).catch((e) => {
      this.text = `错误：${e}`
    })
  },
  destroyed () {
    Timer.destroy()
  }
}
</script>
