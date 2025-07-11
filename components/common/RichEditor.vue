<template>
  <client-only>
    <div>
      <Ckeditor
        v-if="CustomEditor"
        :editor="CustomEditor"
        v-model="internalValue"
        :config="editorConfig"
      />
    </div>
  </client-only>
</template>

<script setup>
import { Ckeditor } from "@ckeditor/ckeditor5-vue";
const props = defineProps({
  value: {
    type: String,
    default: "",
  },
});

useHead({
  script: [
    {
      src: "/ckeditor/ckeditor.js",
      defer: true,
    },
  ],
});

const emit = defineEmits(["update:value"]);

const internalValue = ref(props.value);
const CustomEditor = ref(null);
const editorConfig = {
  width: "auto",
  title: false,
  removePlugins: ["ImageCaption"],
};

watch(
  () => props.value,
  (newVal) => {
    if (newVal !== internalValue.value) {
      internalValue.value = newVal;
    }
  }
);

watch(internalValue, (newVal) => {
  emit("update:value", newVal);
});

onMounted(() => {
  const checkEditor = () => {
    if (window.ClassicEditor) {
      CustomEditor.value = window.ClassicEditor;
    } else {
      setTimeout(checkEditor, 100);
    }
  };
  checkEditor();
});
</script>

<style></style>
