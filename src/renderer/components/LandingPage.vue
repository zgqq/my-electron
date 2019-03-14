/* eslint-disable */
<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
    <input id="input"
           @input="handleInput"
           @keydown="handleKeyDown">
    <main>
      <div class="left-side">
        <div v-for="(item, index) in items"
             :key="index">
          <div class="current-item"
               v-if="currentIndex === index">
            {{item.content}}
          </div>
          <div v-else
               class="item">
            {{item.content}}
          </div>
        </div>
        <!-- <system-information></system-information> -->
      </div>

      <div class="right-side">
        <div class="image-scroll">
          <div class="image-item">
          <img src="http://www.w3school.com.cn/i/eg_tulip.jpg"
                 alt="上海鲜花港 - 郁金香" />
          </div>
          <div class="image-item">
            <img src=""
                 alt="上海鲜花港 - 郁金香" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
// import SystemInformation from './LandingPage/SystemInformation'

export default {
  name: 'landing-page',
  data () {
    return {
      items: [{ content: 'ok' }],
      currentIndex: 0
    }
  },
  mounted () {
    this.$electron.ipcRenderer.on('synchronous-message', (event, args) => {
      console.log('recevie' + args)
    })
  },
  // components: { SystemInformation ,
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    },
    handleInput (event) {
      // alert(event.target.value)
      console.log(event.target.value)
      // alert(event)
    },
    handleKeyDown (event) {
      console.log(event.key)
      var key = event.key
      if (key === 'Enter') {
        var value = event.target.value
        console.log('Handle enter key' + value)
        this.items.push({ content: '' + value })
      }
      if (key === 'ArrowDown') {
        this.currentIndex++
        if (this.currentIndex >= this.items.length) {
          this.currentIndex = 0
        }
      }

      if (key === 'ArrowUp') {
        this.currentIndex--
        if (this.currentIndex < 0) {
          this.currentIndex = 0
        }
      }
    }
  }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 30px 30px;
  width: 100vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

#input {
  margin-bottom: 20px;
  width: 450px;
  height: 40px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}

.item {
  width: 500px;
  height: 60px;
}

.current-item {
  color: #42b983;
  background-color: transparent;
  width: 500px;
  height: 60px;
}

.image-scroll {
  width: 300px;
  height: 400px;
  overflow-y: scroll;
}
</style>
