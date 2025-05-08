<script setup>
import { Ckeditor } from "@ckeditor/ckeditor5-vue";
import {
  ClassicEditor,
  Alignment,
  Bold,
  Essentials,
  Italic,
  Paragraph,
  Underline,
  Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

// Define props to customize the editor features
const props = defineProps({
  /**
   * Features to enable in the toolbar
   * @type {Array}
   * @default ['bold', 'underline', 'alignment']
   */
  features: {
    type: Array,
    default: () => ['bold', 'underline', 'alignment'],
    validator: (value) => {
      const allowedFeatures = ['bold', 'italic', 'underline', 'alignment'];
      return value.every(feature => allowedFeatures.includes(feature));
    }
  },
  
  /**
   * Placeholder text for the editor
   * @type {String}
   */
  placeholder: {
    type: String,
    default: ""
  },
  
  /**
   * Initial content for the editor
   * @type {String}
   */
  initialData: {
    type: String,
    default: ""
  },
  
  /**
   * Editor height
   * @type {String}
   */
  height: {
    type: String,
    default: "auto"
  },
  
  /**
   * Editor width
   * @type {String}
   */
  width: {
    type: String,
    default: "100%"
  },
  
  /**
   * Editor min-height
   * @type {String}
   */
  minHeight: {
    type: String,
    default: "250px"
  },
  
  /**
   * Editor max-height
   * @type {String}
   */
  maxHeight: {
    type: String,
    default: "500px"
  },
  
  /**
   * Border radius
   * @type {String}
   */
  borderRadius: {
    type: String,
    default: "4px"
  },
  
  /**
   * Border color
   * @type {String}
   */
  borderColor: {
    type: String,
    default: "#ccc"
  },
  
  /**
   * Background color
   * @type {String}
   */
  backgroundColor: {
    type: String,
    default: "#ffffff"
  },
  
  /**
   * Custom class names
   * @type {String}
   */
  customClass: {
    type: String,
    default: ""
  },
  
  /**
   * Additional styles as an object
   * @type {Object}
   */
  additionalStyles: {
    type: Object,
    default: () => ({})
  }
});

const modelValue = defineModel("modelValue");

// Define the mapping between feature names and toolbar items
const featureToToolbarItem = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  alignment: "alignment"
};

// Define the mapping between feature names and required plugins
const featureToPlugin = {
  bold: Bold,
  italic: Italic,
  underline: Underline,
  alignment: Alignment
};

// Generate toolbar items based on enabled features
const generateToolbarItems = () => {
  const items = [];
  
  // Always include undo/redo for better UX
  items.push("undo", "redo", "|");
  
  // Add enabled features to toolbar
  props.features.forEach(feature => {
    if (featureToToolbarItem[feature]) {
      items.push(featureToToolbarItem[feature]);
    }
  });
  
  return items;
};

// Generate plugins list based on enabled features
const generatePlugins = () => {
  // Always include essential plugins
  const plugins = [Essentials, Paragraph, Undo];
  
  // Add plugins for enabled features
  props.features.forEach(feature => {
    if (featureToPlugin[feature]) {
      plugins.push(featureToPlugin[feature]);
    }
  });
  
  return plugins;
};

// Computed property to generate styles
const editorStyles = {
  width: props.width,
  height: props.height,
  minHeight: props.minHeight,
  maxHeight: props.maxHeight,
  ...props.additionalStyles
};

// Create editor configuration
const editorConfig = {
  toolbar: {
    items: generateToolbarItems(),
    shouldNotGroupWhenFull: false,
  },
  plugins: generatePlugins(),
  placeholder: props.placeholder,
  initialData: props.initialData,
};
</script>

<template>
  <div 
    class="rich-editor-container" 
    :class="customClass"
    :style="{
      borderRadius: borderRadius,
      borderColor: borderColor,
      backgroundColor: backgroundColor,
      '--editor-min-height': minHeight
    }"
  >
    <Ckeditor
      :editor="ClassicEditor"
      :config="editorConfig"
      :style="editorStyles"
      v-model="modelValue"
    />
  </div>
</template>

<style>
.rich-editor-container {
  border: 1px solid;
  overflow: hidden;
}

/* Customize the editor's toolbar */
.rich-editor-container .ck-toolbar {
  border-bottom-color: inherit;
}

/* Customize the editor's content area */
.rich-editor-container .ck-editor__editable {
  padding: 0 10px;
}

/* Ensure editor takes full height of container */
.rich-editor-container .ck-editor__main {
  height: 100%;
}

.rich-editor-container .ck-editor__main > * {
  min-height: var(--editor-min-height);
}
</style>

