/* eslint-disable no-undef */
<template>
  <div class="vx-col w-full mb-base vs-con-loading__container" id="div-loading">
    <vx-card title="IP Geolocation map">
      <div id="world-map" style="width: 100%; height: 500px"></div>
    </vx-card>
  </div>
</template>

<script>
import deviceApi from "@/api/device";

export default {
  data() {
    return {};
  },
  computed: {
    userId() {
      return JSON.parse(localStorage.getItem("userInfo")).id;
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    async initMap() {
      this.$vs.loading({
        container: "#div-loading",
        scale: 0.6
      });
      const mapData = await deviceApi.getIisLogInfo(this.userId);
      // eslint-disable-next-line no-undef
      $(function() {
        // eslint-disable-next-line no-undef
        $("#world-map").vectorMap({
          map: "world_mill_en",
          scaleColors: ["#C8EEFF", "#0071A4"],
          normalizeFunction: "polynomial",
          hoverOpacity: 0.7,
          hoverColor: false,
          markerStyle: {
            initial: {
              fill: "#FFB70F",
              stroke: "#FFB70F"
            }
          },
          regionStyle: {
            initial: {
              fill: "#5D92F4"
            }
          },
          backgroundColor: "#fff",
          markers: mapData
        });
      });

      this.$vs.loading.close("#div-loading > .con-vs-loading");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>