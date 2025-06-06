<template>
  <client-only>
    <div>
      <ckeditor
        v-if="CustomEditor"
        :editor="CustomEditor"
        v-model="internalValue"
        :config="editorConfig"
      />
    </div>
  </client-only>
</template>

<script>
export default {
  name: "RichEditor",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      internalValue: this.value,
      CustomEditor: null,
      editorConfig: {
        width: "auto",
        title: false,
        removePlugins: ["ImageCaption"],
      },
    };
  },
  watch: {
    value(newVal) {
      if (newVal !== this.internalValue) {
        this.internalValue = newVal;
      }
    },
    internalValue(newVal) {
      this.$emit("input", newVal);
    },
  },
  mounted() {
    if (process.client) {
      import("~/static/ckeditor/ckeditor").then((module) => {
        this.CustomEditor = module.default;
      });
    }
  },
};
</script>

<style src="~/assets/css/ckeditor5.css"></style>

<style></style>
