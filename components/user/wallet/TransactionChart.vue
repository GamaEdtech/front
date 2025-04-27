<template>
  <div class="chart-container">
    <div class="text-h5 primary-gray-700 font-weight-bold pb-2">
      Transaction History
    </div>
    <div class="chart-header d-flex justify-space-between align-center">
      <div></div>
      <!-- <div class="chart-legend d-flex">
        <div class="legend-item d-flex align-center mr-4">
          <v-icon small color="red" class="mr-1">mdi-circle</v-icon>
          <span class="caption">Spent</span>
        </div>
        <div class="legend-item d-flex align-center">
          <v-icon small color="green" class="mr-1">mdi-circle</v-icon>
          <span class="caption">Earned</span>
        </div>
      </div> -->
    </div>
    <div class="chart-wrapper">
      <LineChart :chart-data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line as LineChart } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default defineComponent({
  name: "TransactionChart",
  components: {
    LineChart,
  },
  data() {
    return {
      chartData: {
        labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
        datasets: [
          {
            label: "Spent",
            data: [10, 30, 15, 50, 20, 25, 60],
            borderColor: "rgb(235, 77, 75)",
            backgroundColor: "rgba(235, 77, 75, 0.1)",
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
            fill: false,
          },
          {
            label: "Earned",
            data: [60, 100, 50, 105, 30, 70, 130],
            borderColor: "rgb(46, 213, 115)",
            backgroundColor: "rgba(46, 213, 115, 0.1)",
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 10,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "white",
            titleColor: "#333",
            bodyColor: "#666",
            borderColor: "#eee",
            borderWidth: 1,
            padding: 10,
            displayColors: true,
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                label += context.parsed.y + " $GET";
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#999",
              font: {
                size: 14,
              },
            },
          },
          y: {
            min: 0,
            max: 150,
            ticks: {
              stepSize: 50,
              callback: function (value) {
                return value;
              },
              color: "#999",
              font: {
                size: 14,
              },
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
              borderDash: [3],
              drawBorder: false,
            },
          },
        },
      },
    };
  },
});
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  /* border-radius: 8px;
  padding: 16px; */
}

.chart-header {
  margin-bottom: 16px;
}

.transaction-title {
  font-size: 16px;
}

.chart-wrapper {
  /* height: 160px; */
  position: relative;
}
</style>
