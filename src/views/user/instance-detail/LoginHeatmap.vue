<template>
  <div id="div-login-heatmap" class="vs-con-loading__container">
    <vue-apex-charts
      type="heatmap"
      height="350"
      width="700"
      :options="heatMapChart.chartOptions"
      :series="heatMapChart.series"
    ></vue-apex-charts>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import io from "socket.io-client";
import { SERVER_URL } from "@/utils/constant";
import { getFromStorage } from "@/utils";

export default {
  components: { VueApexCharts },
  data() {
    return {
      themeColors: ["#7367F0", "#28C76F", "#EA5455", "#FF9F43", "#1E1E1E"],
      heatMapChart: {
        series: [],
        chartOptions: {
          colors: ["#EA5455"],
          dataLabels: {
            enabled: false
          }
        }
      },
      socket: io(SERVER_URL),
      database: this.$route.params.database,
      arriveResponse: false,
      timer: null
    };
  },
  computed: {
    userId() {
      return JSON.parse(localStorage.getItem("userInfo")).id;
    }
  },
  mounted() {
    this.getLoginHeatmap();
    this.responseSocket();
    this.checkResponse();
  },
  methods: {
    generateDataHeatMap(count, yrange) {
      var i = 0;
      var series = [];
      while (i < count) {
        var x = "Day" + (i + 1).toString();
        var y =
          Math.floor(Math.random() * (yrange.max - yrange.min + 1)) +
          yrange.min;

        series.push({
          x: x,
          y: y
        });
        i++;
      }
      return series;
    },
    getLoginHeatmap() {
      this.$vs.loading({
        container: "#div-login-heatmap",
        scale: 0.6
      });

      const data = {
        userId: this.userId,
        archerId: getFromStorage("archerId"),
        instance: this.database
      };

      this.socket.emit("REQ_INSTANCE_LOGIN_HEATMAP", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });

      this.socket.on("RES_INSTANCE_LOGIN_HEATMAP", response => {
        console.log("response from RES_INSTANCE_LOGIN_HEATMAP");
        for (const data of response) {
          this.heatMapChart.series.push({
            name: data.Week,
            data: [
              { x: "Sun", y: data.Sun },
              { x: "Mon", y: data.Mon },
              { x: "Tue", y: data.Tue },
              { x: "Wed", y: data.Wed },
              { x: "Thu", y: data.Thu },
              { x: "Fri", y: data.Fri },
              { x: "Sat", y: data.Sat },
              { x: "Weekly", y: data.Weekly }
            ]
          });
        }
        this.$vs.loading.close("#div-login-heatmap > .con-vs-loading");
        this.arriveResponse = true;
      });
    },
    checkResponse() {
      const vm = this;
      setTimeout(() => {
        if (!vm.arriveResponse) {
          vm.$vs.loading.close("#div-login-heatmap > .con-vs-loading");
          vm.$vs.notify({
            color: "warning",
            title: "Warning",
            text: "No response from server."
          });
        }
      }, 1000 * 10);
    }
  },
  beforeDestroy() {
    this.socket.disconnect();
  }
};
</script>

<style lang="scss" scoped>
</style>