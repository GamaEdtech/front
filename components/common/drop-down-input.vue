<template>
  <div
    :class="`custom-dropdown ${isOpen ? `is-open` : ``}  ${
      disabled ? `disable-drop-down` : ``
    }`"
    :style="{
      borderColor: activeInput ? activeColor : ``,
    }"
    ref="customDropdownRef"
  >
    <div class="dropdown-input" @click="toggleDropdown">
      <input
        ref="input"
        v-model="searchText"
        @focus="onInputFocus"
        @input="onSearchInput"
        :disabled="disabled"
      />
      <label :style="labelStyle" :class="labelClass">{{ placeholder }}</label>

      <div class="suffix-icons">
        <v-icon
          v-if="selectedItem"
          class="clear-icon"
          @click.stop="clearSelection"
        >
          mdi-close
        </v-icon>
        <v-icon :class="`arrow-icon ${isOpen ? `rotate` : ` `}`">
          mdi-chevron-down
        </v-icon>
      </div>
    </div>

    <div v-if="isOpen" class="dropdown-menu">
      <template v-if="isLoadingData">
        <div v-for="item in 6" class="skeleton-item skeleton-loader"></div>
      </template>
      <template v-else>
        <div
          v-for="(item, index) in filteredItems"
          :key="index"
          :class="`dropdown-item ${
            item.title == selectedItem?.title ? `selected-item` : ``
          }`"
          @click="selectItem($event, item)"
        >
          {{ item.title }}
        </div>

        <div
          v-if="filteredItems.length === 0 && !isLoadingData"
          class="dropdown-empty"
        >
          Not Found.
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useClickOutside } from "~/composables/useClickOutside";

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  items: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    default: "Choose",
  },
  activeColor: {
    type: String,
    default: "#1976D2",
  },
  itemLabel: {
    type: String,
    default: "label",
  },
  itemValue: {
    type: String,
    default: "value",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isLoadingData: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const customDropdownRef = ref(null);
useClickOutside(customDropdownRef, () => {
  isOpen.value = false;
  isFocused.value = false;
  isFirstOpen.value = true;
  if (!props.modelValue) {
    searchText.value = "";
    selectedItem.value = null;
  }
  if (
    selectedItem.value &&
    searchText.value.toLowerCase() !=
      selectedItem.value.title.toString().toLowerCase()
  ) {
    if (searchText.value == "") {
      emit("update:modelValue", "");
      searchText.value = "";
      selectedItem.value = null;
    } else {
      searchText.value = selectedItem.title.toString();
    }
  }
});

const isOpen = ref(false);
const isFocused = ref(false);
const searchText = ref("");
const input = ref(null);
const isFirstOpen = ref(true);
const selectedItem = ref(null);
const filteredItems = ref(props.items);

const activeInput = computed(() => isFocused.value || isOpen.value);

const labelStyle = computed(() => ({
  color: isFocused.value || isOpen.value ? props.activeColor : "",
}));

const labelClass = computed(() =>
  isFocused.value || isOpen.value || props.modelValue
    ? "active-lable-class"
    : ""
);
const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      input.value.focus();
      filteredItems.value = props.items;
    } else {
      input.value.blur();
      isFirstOpen.value = true;
    }
  }
};

const selectItem = (event, item) => {
  event.stopPropagation();
  emit("update:modelValue", item.id.toString());
  selectedItem.value = item;
  searchText.value = item.title;
  isOpen.value = false;
  isFocused.value = false;
  isFirstOpen.value = true;
};

const clearSelection = (event) => {
  event.stopPropagation();
  emit("update:modelValue", "");
  selectedItem.value = null;
  searchText.value = "";
  isOpen.value = false;
  isFocused.value = false;
};

const onInputFocus = () => {
  isFocused.value = true;
};

const onSearchInput = (event) => {
  if (isFirstOpen.value || event.target.value.length == 0) {
    filteredItems.value = props.items;
  } else {
    filteredItems.value = props.items.filter((item) => {
      return item.title
        .toString()
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
  }
  isFirstOpen.value = false;
};

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      searchText.value = "";
    }
  }
);

watch(
  () => props.items,
  () => {
    filteredItems.value = props.items;
    if (!props.modelValue) {
      searchText.value = "";
    } else {
      let selected = props.items.filter(
        (item) => item.id == Number(props.modelValue)
      );
      if (selected.length > 0) {
        selectedItem.value = selected[0];
        searchText.value = selectedItem.value.title;
      }
    }
  }
);

onMounted(() => {
  if (!props.modelValue) {
    searchText.value = "";
  } else {
    let selected = props.items.filter(
      (item) => item.id == Number(props.modelValue)
    );
    if (selected.length > 0) {
      selectedItem.value = selected[0];
      searchText.value = selectedItem.value.title;
    }
  }
});
</script>

<style scoped>
@import "../../assets/scss/common/drop-down-input.scss";
</style>
