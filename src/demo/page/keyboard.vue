<template>
  <div class="keyboard">
    <div class="reference"></div>
    <div class="reference dep45"></div>
    <div class="context">
      <div class="ellipse"
           :class="`b${key}`"
           @click="click(value)"
           v-for="(value, key) in keys">
        <span class="arrow"></span>
      </div>
      <div class="center"></div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      keys: {
        0: '0',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7'
      }
    }
  },
  methods: {
    click (v) {
      console.log('click' + v)
    }
  },
  mounted () {

  }
}
</script>
<style lang="less">
  .util-content {
    position: absolute;
    display: block;
    content: '';
  }

  .keyboard {
    position: relative;
    width: 400px;
    height: 400px;
    padding: 0;
    overflow: hidden;

    .reference {
      transform: rotate(22.5deg);
      border: 200px solid #00000054;
      border-top-color: #00000036;
      border-right-color: #00000061;
      border-bottom-color: #00000036;

      &.dep45 {
        position: absolute;
        top: 0;
        transform: rotate(67.5deg);
      }
    }

    .context,
    .center {
      width: 100%;
      height: 100%;
      border-radius: 100%;
      background-color: #555;
      overflow: hidden;
    }

    .context {
      position: relative;
      top: -250px;
      left: 150px;
      width: 100px;
      height: 100px;
    }

    .center {
      position: absolute;
      top: 25px;
      left: 25px;
      width: 50px;
      height: 50px;
      background-color: #333;
      z-index: 9000;
    }

    .b0 {
      top: -3px;
      left: 40px;
    }

    .b1 {
      top: 8px;
      left: 66px;
      transform: rotate(45deg);
      -ms-transform: rotate(45deg);
    }

    .b2 {
      top: 35px;
      left: 76px;
      transform: rotate(90deg);
      -ms-transform: rotate(90deg);
    }

    .b3 {
      top: 62px;
      left: 66px;
      transform: rotate(135deg);
      -ms-transform: rotate(135deg);
    }

    .b4 {
      top: 73px;
      left: 40px;
      transform: rotate(180deg);
      -ms-transform: rotate(180deg);
    }
    .b5 {
      top: 62px;
      left: 13px;
      transform: rotate(225deg);
      -ms-transform: rotate(225deg);
    }
    .b6 {
      top: 35px;
      left: 2px;
      transform: rotate(270deg);
      -ms-transform: rotate(270deg);
    }
    .b7 {
      top: 8px;
      left: 13px;
      transform: rotate(315deg);
      -ms-transform: rotate(315deg);
    }

    .arrow {
      position: relative;
      display: block;
      width: 0;
      margin: 4px auto;
      border: 5px solid transparent;
      border-bottom: 9px solid #c1c1c1;
      z-index: 1000;
    }

    .ellipse {
      position: absolute;
      width: 20px;
      height: 30px;

      &:hover {
        cursor: pointer;
        background-color: #333;

        > .arrow{
          border-bottom-color: #fff;
        }

        &:after {
          background-color: #333;
        }
        &:before {
          background-color: #333;
        }
      }

      &:after {
        &:extend(.util-content);
        width: 20px;
        height: 30px;
        top: 0;
        left: -5px;
        transform:rotate(-22.5deg);
        -ms-transform: rotate(-22.5deg);
      }
      &:before {
        &:extend(.util-content);
        width: 20px;
        height: 30px;
        top: 0;
        left: 5px;
        transform:rotate(22.5deg);
        -ms-transform: rotate(22.5deg);
      }
    }
  }
</style>
