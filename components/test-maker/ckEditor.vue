<template>
  <ckeditor
      v-model="data"
      :editor="ClassicEditor"
      :config="config"
      style="height: 500px;"
      class="ck-editor"
  />
</template>

<script setup>
import { ClassicEditor, Essentials, Paragraph, Bold, Italic } from 'ckeditor5';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';

import 'ckeditor5/ckeditor5.css';

const data = ref( '<p>Hello world!</p>' );

const config = computed( () => {
  return {
      licenseKey: 'GPL',
      plugins: [ Essentials, Paragraph, Bold, Italic ],
      toolbar: [ 'undo', 'redo', '|', 'bold', 'italic', '|']
  };
} );
</script>

<style >
.ck-content{
  min-height: 500px !important;
  height: 500px !important;
}
</style>

