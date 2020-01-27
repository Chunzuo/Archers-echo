<template>
  <div
    id="div-ticket-analytics"
    class="vx-col w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-base vs-con-loading__container"
  >
    <vx-card title="HelpDesk Tickets">
      <!-- CARD ACTION -->
      <template slot="actions"></template>

      <div slot="no-body">
        <div class="vx-row text-center">
          <div class="vx-col sm:w-1/5 w-full flex flex-col justify-between mb-4">
            <div class="ml-6 mt-6">
              <h1 class="font-bold text-5xl">{{totalCount}}</h1>
              <small>Tickets</small>
            </div>
          </div>
          <div class="vx-col sm:w-4/5 justify-center mx-auto">
            <vue-apex-charts
              type="radialBar"
              height="250"
              :options="supportTrackerRadialBar.chartOptions"
              :series="supportTrackerRadialBar.series"
            />
          </div>
        </div>
        <div class="flex flex-row justify-between px-8 pb-4">
          <p class="text-center">
            <span class="block">Open Tickets</span>
            <span class="text-4xl">{{openCount}}</span>
          </p>
          <p class="text-center">
            <span class="block">InProgress Tickets</span>
            <span class="text-4xl">{{inProgressCount}}</span>
          </p>
          <p class="text-center">
            <span class="block">Stop Tickets</span>
            <span class="text-4xl">{{stopCount}}</span>
          </p>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import helpDeskApi from "@/api/helpDesk";
export default {
  components: {
    VueApexCharts
  },
  data() {
    return {
      supportTrackerRadialBar: {
        series: [0],
        chartOptions: {
          plotOptions: {
            radialBar: {
              size: 150,
              startAngle: -150,
              endAngle: 150,
              hollow: {
                size: "65%"
              },
              track: {
                background: "#fff",
                strokeWidth: "100%"
              },
              dataLabels: {
                value: {
                  offsetY: 30,
                  color: "#99a2ac",
                  fontSize: "2rem"
                }
              }
            }
          },
          colors: ["#EA5455"],
          fill: {
            type: "gradient",
            gradient: {
              // enabled: true,
              shade: "dark",
              type: "horizontal",
              shadeIntensity: 0.5,
              gradientToColors: ["#7367F0"],
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 100]
            }
          },
          stroke: {
            dashArray: 8
          },
          chart: {
            sparkline: {}
          },
          labels: ["Completed Tickets"]
        }
      },
      totalCount: 0,
      openCount: 0,
      inProgressCount: 0,
      stopCount: 0
    };
  },
  computed: {
    userId() {
      return JSON.parse(localStorage.getItem("userInfo")).id;
    }
  },
  mounted() {
    console.log(this.userId);
    this.getTicketAnalytics();
  },
  methods: {
    async getTicketAnalytics() {
      this.$vs.loading({ container: "#div-ticket-analytics" });
      const helpDesks = await helpDeskApi.getMyHelpDeskTickets(this.userId);
      // console.log(helpDesks);
      this.totalCount = helpDesks.length;
      let doneCount = 0;
      for (const helpDesk of helpDesks) {
        if (helpDesk.status === 0) {
          this.openCount += 1;
        } else if (helpDesk.status === 1) {
          this.inProgressCount += 1;
        } else if (helpDesk.status === 2) {
          this.stopCount += 1;
        } else if (helpDesk.status === 3) {
          doneCount += 1;
        }
      }
      const completePercent =
        doneCount === 0 ? 0 : (doneCount / this.totalCount) * 100;
      // console.log(completePercent);
      this.supportTrackerRadialBar.series = [completePercent];
      this.$vs.loading.close("#div-ticket-analytics > .con-vs-loading");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>