<template>
  <div class="description-holder my-4">
    <!--Description-->
    <div class="description-tabs">
      <v-tabs v-model="activeTab" color="teal">
        <v-tab value="tab-description">
          <span class="gama-text-caption">Description</span>
        </v-tab>
        <v-tab value="tab-chapters">
          <span class="gama-text-caption">Book chapters</span>
        </v-tab>
      </v-tabs>
    </div>
    <div class="description-tabs">
      <v-window v-model="activeTab">
        <v-window-item value="tab-description" class="px-3 py-3">
          <span
            class="gama-text-body2"
            v-show="!isEditing"
            v-html="formattedDescription"
          />
          <v-btn
            v-if="canEdit"
            v-show="!isEditing"
            @click="startEditing"
            icon
            size="x-small"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <div>
            <v-textarea
              v-if="isEditing"
              width="100%"
              rows="18"
              placeholder="Description"
              v-model="description"
            >
              <template v-slot:append-outer>
                <v-btn
                  color="success"
                  @click="saveDescription"
                  icon
                  size="x-small"
                  :loading="saving"
                >
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </template>
            </v-textarea>
          </div>
        </v-window-item>
        <v-window-item value="tab-chapters" class="px-3 py-3">
          <div color="#F5F5F5" flat style="max-height: 25rem; overflow-y: auto">
            <ul class="pl-0" style="list-style-type: none">
              <li v-for="(item, index) in collectionList" :key="index">
                <strong>{{ item.title }}</strong>
                <ul
                  style="list-style-type: none"
                  v-if="item.chapters && item.chapters.length"
                >
                  <li
                    v-for="(chapter, chapterIndex) in item.chapters"
                    :key="chapterIndex"
                  >
                    {{ chapter.title }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </v-window-item>
      </v-window>
    </div>
    <!--End description-->
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  description: {
    type: String,
    default: "",
  },
  collectionList: {
    type: Array,
    default: () => [],
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:description", "save"]);

// UI state
const activeTab = ref("tab-description");
const isEditing = ref(false);
const saving = ref(false);
const description = ref(props.description);

// Formatted description with line breaks
const formattedDescription = computed(() => {
  return description.value ? description.value.replace(/\n/g, "<br />") : "";
});

// Methods
function startEditing() {
  isEditing.value = true;
}

async function saveDescription() {
  saving.value = true;

  // Update the parent component
  emit("update:description", description.value);

  // Tell the parent to save
  await emit("save");

  // Reset UI state
  isEditing.value = false;
  saving.value = false;
}

// Watch for prop changes
watch(
  () => props.description,
  (newVal) => {
    if (newVal !== description.value) {
      description.value = newVal;
    }
  }
);
</script>

<style scoped>
.description-holder .v-tab {
  font-size: 1rem !important;
}

.description-holder .description-tabs {
  background: #f5f5f5 !important;
  padding: 0.8rem !important;
  border-radius: 0.8rem;
  margin-bottom: 1rem;
}
</style>
