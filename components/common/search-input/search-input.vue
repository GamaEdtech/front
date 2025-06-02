<template>
  <div class="main-search-input-div">
    <div
      class="custom-text-field"
      :class="{ 'has-value': hasValue, disable: disable }"
      :style="{
        borderColor: hasValue ? activeColor : `#ccc`,
      }"
    >
      <v-icon class="prefix-icon" :style="labelStyle">{{ icon }}</v-icon>
      <input
        ref="input"
        :value="modelValue"
        @input="onInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :disabled="disable"
      />
      <label :style="labelStyle">{{ placeholder }}</label>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "mdi-menu",
  },
  activeColor: {
    type: String,
    default: "#1976D2",
  },
  disable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isFocused = ref(false);
const input = ref(null);

const hasValue = computed(() => props.modelValue.length > 0 || isFocused.value);

const labelStyle = computed(() => ({
  color:
    isFocused.value || props.modelValue.length > 0 ? props.activeColor : "",
}));

const onInput = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<style scoped>
@import "./search-input.scss";
</style>
