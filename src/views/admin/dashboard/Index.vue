<template>
  <div id="dashboard-analytics">
    <div class="vx-row">
      <!-- CARD 1: CONGRATS -->
      <div class="vx-col w-full lg:w-1/2 mb-base">
        <vx-card slot="no-body" class="text-center bg-primary-gradient greet-user">
          <img
            src="@/assets/images/elements/decore-left.png"
            class="decore-left"
            alt="Decore Left"
            width="200"
          >
          <img
            src="@/assets/images/elements/decore-right.png"
            class="decore-right"
            alt="Decore Right"
            width="175"
          >
          <feather-icon
            icon="AwardIcon"
            class="p-6 mb-8 bg-primary inline-flex rounded-full text-white shadow"
            svgClasses="h-8 w-8"
          ></feather-icon>
          <h1 class="mb-6 text-white">Congratulations nbrenke,</h1>
          <p class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto text-white">
            You have done
            <strong>57.6%</strong> more sales today. Check your new badge in your profile.
          </p>
        </vx-card>
      </div>

      <!-- CARD 2: SUBSCRIBERS GAINED -->
      <div class="vx-col w-full lg:w-1/2 mb-base">
        <statistics-card-line
          icon="UsersIcon"
          statistic="92.6k"
          statisticTitle="Subscribers Gained"
          :chartData="subscribersGained"
          type="area"
        ></statistics-card-line>
      </div>

      <!-- CARD 3: ORDER RECIEVED -->
      <!-- <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          icon="ShoppingBagIcon"
          statistic="97.5K"
          statisticTitle="Orders Received"
          :chartData="ordersRecevied"
          color="warning"
          type="area"
        ></statistics-card-line>
      </div>-->
    </div>
  </div>
</template>

<script>
import StatisticsCardLine from "@/components/statistics-cards/StatisticsCardLine.vue";
export default {
  components: {
    StatisticsCardLine
  },
  data() {
    return {
      subscribersGained: {
        series: [
          {
            name: "Subscribers",
            data: [28, 40, 36, 52, 38, 60, 55]
          }
        ],
        chartOptions: {
          grid: {
            show: false,
            padding: {
              left: 0,
              right: 0
            }
          },
          chart: {
            toolbar: {
              show: false
            },
            sparkline: {
              enabled: true
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "smooth",
            width: 2.5
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 0.9,
              opacityFrom: 0.7,
              opacityTo: 0.5,
              stops: [0, 80, 100]
            }
          },
          xaxis: {
            type: "numeric",
            lines: {
              show: false
            },
            axisBorder: {
              show: false
            },
            labels: { show: false }
          },
          yaxis: [
            {
              y: 0,
              offsetX: 0,
              offsetY: 0,
              padding: { left: 0, right: 0 }
            }
          ],
          tooltip: {
            x: { show: false }
          }
        }
      },
      ordersRecevied: {
        series: [
          {
            name: "Orders",
            data: [10, 15, 8, 15, 7, 12, 8]
          }
        ],
        chartOptions: {
          grid: {
            show: false,
            padding: {
              left: 0,
              right: 0
            }
          },
          chart: {
            toolbar: {
              show: false
            },
            sparkline: {
              enabled: true
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "smooth",
            width: 2.5
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 0.9,
              opacityFrom: 0.7,
              opacityTo: 0.5,
              stops: [0, 80, 100]
            }
          },
          xaxis: {
            type: "numeric",
            lines: {
              show: false
            },
            axisBorder: {
              show: false
            },
            labels: { show: false }
          },
          yaxis: [
            {
              y: 0,
              offsetX: 0,
              offsetY: 0,
              padding: { left: 0, right: 0 }
            }
          ],
          tooltip: {
            x: { show: false }
          }
        }
      }
    };
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
#dashboard-analytics {
  .greet-user {
    position: relative;
    .decore-left {
      position: absolute;
      left: 0;
      top: 0;
    }
    .decore-right {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  @media (max-width: 576px) {
    .decore-left,
    .decore-right {
      width: 140px;
    }
  }
}
</style>