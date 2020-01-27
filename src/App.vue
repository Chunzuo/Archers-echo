<!-- =========================================================================================
	File Name: App.vue
	Description: Main vue file - APP
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Version: 1.1
	Author: Pixinvent
	Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import themeConfig from "@/../themeConfig.js";
import userApi from "@/api/user";

export default {
  watch: {
    "$store.state.themeConfig.theme"(val) {
      this.toggleClassInBody(val);
    },
    "$store.state.themeConfig.primaryColor"(val) {
      this.updatePrimaryColor(val);
    }
  },
  methods: {
    toggleClassInBody(className) {
      if (className == "dark") {
        if (document.body.className.match("theme-semi-dark"))
          document.body.classList.remove("theme-semi-dark");
        document.body.classList.add("theme-dark");
      } else if (className == "semi-dark") {
        if (document.body.className.match("theme-dark"))
          document.body.classList.remove("theme-dark");
        document.body.classList.add("theme-semi-dark");
      } else {
        if (document.body.className.match("theme-dark"))
          document.body.classList.remove("theme-dark");
        if (document.body.className.match("theme-semi-dark"))
          document.body.classList.remove("theme-semi-dark");
      }
    },
    updatePrimaryColor(val) {
      this.$vs.theme({ primary: val });
    }
  },
  mounted() {
    this.$store.dispatch("themeConfig/getInfo");
    this.toggleClassInBody(this.theme);
  },
  computed: {
    theme() {
      return this.$store.state.themeConfig.theme;
    },
    primaryColor() {
      return this.$store.state.themeConfig.primaryColor;
    }
  },
  socket: {
    events: {
      connect() {
        // console.log("Websocket connected");
        // console.log(this.$socket);
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) {
          userApi
            .updateSocketId({
              socketId: this.$socket.id,
              userId: user.id
            })
            .then(() => {
              // console.log("SocketId updated!");
            });
        }
      },
      disconnect() {
        // console.log("Websocket disconnected");
        // console.log(this.$socket.id);
      },
      error(err) {
        console.log("Websocket error!", err);
      }
    }
  },
  beforeDestroy() {
    this.$socket.disconnect();
  }
};
</script>