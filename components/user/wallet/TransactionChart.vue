<template>
  <div class="chart-container">
    <div class="text-h5 primary-gray-700 font-weight-bold pb-2">
      Transaction History
    </div>

    <div
      v-if="loading"
      class="chart-loading d-flex justify-center align-center"
    >
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else class="chart-wrapper">
      <LineChart
        :data="chartData"
        :options="chartOptions"
        style="min-height: 240px"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
);

export default defineComponent({
  name: "TransactionChart",
  components: {
    LineChart: Line,
  },

  data() {
    return {
      loading: false,
      selectedPeriod: "MonthOfYear",
      periodOptions: [
        { text: "Monthly", value: "MonthOfYear" },
        { text: "Weekly", value: "DayOfWeek" },
      ],
      token: "",
      chartData: {
        labels: [],
        datasets: [
          {
            label: "Spent",
            data: [],
            borderColor: "rgb(235, 77, 75)",
            backgroundColor: "rgb(235, 77, 75)",
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
            fill: false,
          },
          {
            label: "Earned",
            data: [],
            borderColor: "rgb(46, 213, 115)",
            backgroundColor: "rgb(46, 213, 115)",
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
          // padding: {
          //   left: 10,
          //   right: 30,
          //   top: 20,
          //   bottom: 30,
          // },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "end",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              padding: 25,
              boxWidth: 10,
              boxHeight: 10,
              color: "#666",
              font: {
                size: 12,
              },
            },
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
                size: 12,
              },
              padding: 10,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 50,
              callback: function (value) {
                return value;
              },
              color: "#999",
              font: {
                size: 12,
              },
              padding: 10,
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
  created() {
    this.getToken();
    this.fetchChartData();
  },
  methods: {
    getToken() {
      if (process.client) {
        this.token = localStorage.getItem("v2_token") || "";
      }
    },
    fetchChartData() {
      this.loading = true;

      this.$axios
        .$get("/api/v2/transactions/statistics", {
          params: {
            Period: this.selectedPeriod,
          },
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((response) => {
          if (response.succeeded && response.data) {
            this.updateChartWithData(response.data);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status == 403) {
            this.$auth.logout();
          }
          console.error("Error fetching chart data:", err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    updateChartWithData(data) {
      // Filter out the empty record
      const filteredData = data.filter((item) => item.name !== "");

      // Extract labels and values
      const labels = filteredData.map((item) => item.name);
      const debitValues = filteredData.map((item) => item.debitValue);
      const creditValues = filteredData.map((item) => item.creditValue);

      // Calculate max value for Y axis
      const maxValue = Math.max(
        ...debitValues,
        ...creditValues,
        50 // Minimum value to show on the chart
      );

      // Update chart data
      this.chartData = {
        labels: labels,
        datasets: [
          {
            label: "Spent",
            data: debitValues,
            borderColor: "rgb(235, 77, 75)",
            backgroundColor: "rgb(235, 77, 75)",
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
            fill: false,
          },
          {
            label: "Earned",
            data: creditValues,
            borderColor: "rgb(46, 213, 115)",
            backgroundColor: "rgb(46, 213, 115)",
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
            fill: false,
          },
        ],
      };

      // Update Y axis scale
      this.chartOptions = {
        ...this.chartOptions,
        scales: {
          ...this.chartOptions.scales,
          y: {
            ...this.chartOptions.scales.y,
            suggestedMax: Math.ceil(maxValue * 1.1), // Add 10% padding
          },
        },
      };
    },
  },
});
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}

.transaction-title {
  font-size: 16px;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.chart-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.period-selector {
  max-width: 150px;
}

.legend-item {
  font-size: 12px;
}
.transaction-chart {
  margin-bottom: 0 !important;
}
.chart-loading {
  height: 200px;
}
</style>
