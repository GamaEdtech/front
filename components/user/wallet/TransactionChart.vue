<template>
  <div class="chart-container">
    <div class="text-h5 primary-gray-700 font-weight-bold pb-2">
      Transaction History
    </div>
    <div class="chart-header d-flex justify-space-between align-center">
      <!-- <div class="chart-legend d-flex">
        <div class="legend-item d-flex align-center mr-4">
          <v-icon small color="rgb(235, 77, 75)" class="mr-1"
            >mdi-circle</v-icon
          >
          <span class="caption">Spent</span>
        </div>
        <div class="legend-item d-flex align-center">
          <v-icon small color="rgb(46, 213, 115)" class="mr-1"
            >mdi-circle</v-icon
          >
          <span class="caption">Earned</span>
        </div>
      </div> -->
    </div>

    <div
      v-if="loading"
      class="chart-loading d-flex justify-center align-center"
    >
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else class="chart-wrapper">
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
      loading: false,
      selectedPeriod: "MonthOfYear",
      periodOptions: [
        { text: "Monthly", value: "MonthOfYear" },
        { text: "Weekly", value: "DayOfWeek" },
      ],
      chartData: {
        labels: [],
        datasets: [
          {
            label: "Spent",
            data: [],
            borderColor: "rgb(235, 77, 75)",
            backgroundColor: "rgba(235, 77, 75, 0.1)",
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
            fill: false,
          },
          {
            label: "Earned",
            data: [],
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
                size: 12,
              },
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
    this.fetchChartData();
  },
  methods: {
    fetchChartData() {
      this.loading = true;

      this.$axios
        .$get("/api/v2/transactions/statistics", {
          params: {
            Period: this.selectedPeriod,
          },
          headers: {
            Authorization: `Bearer 4|CfDJ8Cz+misSx9pPrdOrX4tMKdGanNw5GkZ5Q6YVakgNeecUUIXBYmeyn4LfeoGh4hLhEYy3IM483xASjXAiHtPxZSCzWZhTWEK6iahsRFLPPSlVkaeAgXgrWzu8aKW4vVz6hp1ueenGKVY7REuttLmtdN4+SPhln6+CpeT1UoO69NFGRoMR4KZ02QNhNyp1m+p74M1viE2prGhwQkrq1/Xk1SESwigoI99fBAwHOTEby8Wc`,
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
            backgroundColor: "rgba(235, 77, 75, 0.1)",
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
            fill: false,
          },
          {
            label: "Earned",
            data: creditValues,
            borderColor: "rgb(46, 213, 115)",
            backgroundColor: "rgba(46, 213, 115, 0.1)",
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

.chart-header {
  margin-bottom: 16px;
}

.transaction-title {
  font-size: 16px;
}

.chart-wrapper {
  height: 250px;
  position: relative;
}

.period-selector {
  max-width: 150px;
}

.legend-item {
  font-size: 12px;
}

.chart-loading {
  height: 250px;
}
</style>
