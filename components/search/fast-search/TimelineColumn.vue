<template>
  <v-col cols="2" class="timeline-column text-center">
    <div 
      v-for="(yearData, yearIndex) in timeline" 
      :key="yearIndex" 
      class="timeline-group"
    >
      <div class="timeline-year">{{ yearData.year }}</div>

      <div 
        v-for="(monthPair, idx) in getMonthPairs(yearData.months)" 
        :key="idx" 
        class="timeline-box"
      >
        <div class="timeline-month">{{ monthPair[0] }}</div>
        <div class="timeline-submonth" v-if="monthPair[1]">
          {{ monthPair[1] }}
        </div>
      </div>
    </div>
  </v-col>
</template>

<script>
export default {
  name: 'TimelineColumn',
  props: {
    timeline: {
      type: Array,
      required: true
    }
  },
  methods: {
    getMonthPairs(months) {
      const pairs = [];
      for (let i = 0; i < months.length; i += 2) {
        pairs.push([months[i], months[i + 1]]);
      }
      return pairs;
    }
  }
}
</script>

<style scoped>
.timeline-column {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-column::before {
  content: "";
  position: absolute;
  top: 28px;
  bottom: 0;
  left: 50%;
  width: 2px;
  background-color: #e4e7ec;
  transform: translateX(-50%);
  z-index: 0;
}

.timeline-group {
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.timeline-year {
  font-size: 12px;
  color: #98a2b3;
  margin-bottom: 40px;
  background: #fff;
  position: relative;
}
.timeline-year::after {
  content: "";
  position: absolute;
  bottom: -7px;
  left: 50%;
  transform: translateX(-50%);
  width: 7px;
  height: 7px;
  background-color: #e4e7ec;
  border-radius: 50%;
  z-index: 2;
}

.timeline-box {
  background-color: #f2f4f7;
  border-radius: 8px;
  margin: 50px 0;
  min-width: 82px;
  min-height: 82px;
  text-align: center;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.timeline-month {
  font-weight: 600;
  font-size: 14px;
  color: #101828;
}

.timeline-submonth {
  font-weight: 400;
  font-size: 12px;
  color: #667085;
  margin-top: 2px;
}
</style> 