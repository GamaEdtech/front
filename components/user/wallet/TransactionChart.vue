<template>
  <div class="chart-container">
    <div class="chart-legend d-flex justify-end mb-2">
      <div class="legend-item d-flex align-center mr-4">
        <v-icon small color="red" class="mr-1">mdi-circle</v-icon>
        <span class="caption">Spent</span>
      </div>
      <div class="legend-item d-flex align-center">
        <v-icon small color="green" class="mr-1">mdi-circle</v-icon>
        <span class="caption">Earned</span>
      </div>
    </div>
    <div class="transaction-chart-container">
      <!-- Y-axis Labels -->
      <div class="y-axis-labels">
        <div class="y-label">150</div>
        <div class="y-label">100</div>
        <div class="y-label">50</div>
        <div class="y-label">10</div>
      </div>

      <!-- X-axis Labels -->
      <div class="x-axis-labels">
        <div v-for="(day, index) in days" :key="index" class="day-label">
          {{ day }}
        </div>
      </div>

      <!-- Chart Content -->
      <div class="chart-content">
        <svg class="chart-svg" viewBox="0 0 700 200" preserveAspectRatio="none">
          <!-- Optional Grid Lines -->
          <line class="grid-line" x1="0" y1="50" x2="700" y2="50" />
          <line class="grid-line" x1="0" y1="100" x2="700" y2="100" />
          <line class="grid-line" x1="0" y1="150" x2="700" y2="150" />

          <!-- Earned Line -->
          <path
            class="line earned-line"
            d="M0,100 C50,60 100,40 150,90 C200,140 250,120 300,90 C350,60 400,20 450,80 C500,140 550,160 600,120 C650,80 700,25 700,25"
          />

          <!-- Spent Line -->
          <path
            class="line spent-line"
            d="M0,170 C50,150 100,130 150,160 C200,190 250,170 300,140 C350,110 400,130 450,160 C500,190 550,170 600,130 C650,90 700,110 700,110"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TransactionChart",
  data() {
    return {
      days: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    };
  },
});
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}

.transaction-chart-container {
  height: 210px;
  position: relative;
  margin-top: 20px;
  padding-left: 30px;
}

.y-axis-labels {
  position: absolute;
  top: 0;
  left: 0;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.y-label {
  height: 20px;
  line-height: 0;
  text-align: right;
  width: 25px;
}

.x-axis-labels {
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 30px;
  right: 0;
  font-size: 12px;
  color: #999;
}

.day-label {
  text-align: center;
  width: 14.28%;
}

.chart-content {
  position: relative;
  height: 180px;
}

.chart-svg {
  width: 100%;
  height: 100%;
}

.grid-line {
  stroke: #eee;
  stroke-width: 1;
  stroke-dasharray: 3, 3;
}

.line {
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.earned-line {
  stroke: rgb(46, 213, 115);
}

.spent-line {
  stroke: rgb(235, 77, 75);
}
</style>
