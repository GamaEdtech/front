<template>
  <div class="d-flex mt-11 mb-9">
    <div class="gtext-h5 gtext-md-h5 primary-gray-600">Tuition fee</div>
    <v-spacer />
    <div class="gtext-t2 font-weight-heavy primary-gray-800">
      <span v-show="contentData.tuition_fee">
        <span class="gtext-t6">$</span>
        {{ numberFormat(contentData.tuition_fee) }}
      </span>
      <span v-show="!contentData.tuition_fee">(N/A)</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  contentData: {
    type: Object,
    required: true,
  },
});
function numberFormat(value) {
  if (!value) return "";
  return value.toLocaleString();
}
</script>
