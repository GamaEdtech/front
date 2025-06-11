<template>
  <div ref="questionRootRef" class="question-item pa-4">
    <div class="d-flex mb-2">
      <div class="font-weight-bold mr-2">{{ index + 1 }})</div>
      <div v-html="item.question" />
    </div>
    
    <img v-if="item.q_file && item.q_file !== '0'" class="answer-img mb-4" :src="item.q_file" alt="Question Image" loading="lazy" />

    <v-radio-group
      :model-value="modelValue"
      @update:modelValue="onAnswerChange"
      class="answer-group"
      color="orange"
    >
      <v-radio :value="'1'">
        <template #label><div class="d-flex align-center " v-html="`1)&nbsp;${item.answer_a}`"></div></template>
      </v-radio>
      <v-radio :value="'2'">
        <template #label><div class="d-flex align-center" v-html="`2)&nbsp;${item.answer_b}`"></div></template>
      </v-radio>
      <v-radio :value="'3'">
        <template #label><div class="d-flex align-center" v-html="`3)&nbsp;${item.answer_c}`"></div></template>
      </v-radio>
      <v-radio :value="'4'">
        <template #label><div class="d-flex align-center" v-html="`4)&nbsp;${item.answer_d}`"></div></template>
      </v-radio>
    </v-radio-group>

    <div class="mt-2">
      <v-btn
        icon="mdi-eraser"
        size="x-small"
        variant="text"
        class="mr-2"
        @click="$emit('erase', item.id)"
        aria-label="Erase answer"
      ></v-btn>
      <v-btn
        icon="mdi-pin"
        size="x-small"
        :color="isPinned ? 'teal' : 'default'"
        variant="text"
        @click="$emit('pin', item.id)"
        aria-label="Pin question"
      ></v-btn>
    </div>
    
    <v-divider class="mt-4" />
  </div>
</template>

<script setup>
const props = defineProps({
  item: { type: Object, required: true },
  index: { type: Number, required: true },
  modelValue: { type: [String, Number], default: null },
  isPinned: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'pin', 'erase']);

const questionRootRef = ref(null);
const { $renderMathInElement, $ensureMathJaxReady } = useNuxtApp();

const onAnswerChange = (value) => {
  emit('update:modelValue', value);
};

onMounted(async () => {
  if (process.client && questionRootRef.value) {
    try {
      await $ensureMathJaxReady();
      $renderMathInElement(questionRootRef.value);
    } catch (error) {
      console.error("Error during MathJax typesetting in QuestionItem:", error);
    }
  }
});
</script>

<style scoped>
.question-item {
  border-bottom: 1px solid #eee;
}
.answer-img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid #ddd;
}
.answer-group .v-radio {
    width: 100%;
}
</style>
