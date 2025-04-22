<template>
  <div>
    <div class="d-flex mb-4">
      <div class="w-100">
        <div class="d-flex align-center justify-space-between header">
          <h1 class="gama-text-h5" v-show="!editMode.title">
            {{ title }}
            <v-btn
              v-if="isOwner"
              @click="editMode.title = true"
              fab
              depressed
              x-small
            >
              <v-icon> mdi-pencil </v-icon>
            </v-btn>
          </h1>
        </div>
        <div class="w-100">
          <v-textarea
            v-if="editMode.title"
            placeholder="Title"
            rows="3"
            v-model="titleModel"
          >
            <template #append-outer>
              <v-btn
                color="success"
                @click="$emit('update-details')"
                fab
                depressed
                :loading="editMode.title_loading"
                x-small
              >
                <v-icon> mdi-check </v-icon>
              </v-btn>
            </template>
          </v-textarea>
        </div>
        <div class="description-holder my-4">
          <!--Description-->
          <span
            v-show="!editMode.describe"
            :class="isMobile ? 'gama-text-body1' : 'gama-text-body2'"
            v-html="formattedDescription"
          />
          <v-btn
            v-if="isOwner"
            v-show="!editMode.describe"
            @click="editMode.describe = true"
            fab
            depressed
            x-small
          >
            <v-icon> mdi-pencil </v-icon>
          </v-btn>
          <div>
            <v-textarea
              v-if="editMode.describe"
              width="100%"
              rows="18"
              placeholder="Description"
              v-model="descriptionModel"
            >
              <template #append-outer>
                <v-btn
                  color="success"
                  @click="$emit('update-details')"
                  fab
                  depressed
                  :loading="editMode.describe_loading"
                  x-small
                >
                  <v-icon> mdi-check </v-icon>
                </v-btn>
              </template>
            </v-textarea>
          </div>
          <!--End description-->
        </div>

        <div class="label-holder">
          <slot name="labels"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  editMode: {
    type: Object,
    default: () => ({
      title: false,
      describe: false,
      title_loading: false,
      describe_loading: false,
    }),
  },
  isOwner: {
    type: Boolean,
    default: false,
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update-details"]);

const titleModel = ref(props.title);
const descriptionModel = ref(props.description);

const formattedDescription = computed(() => {
  return props.description ? props.description.replace(/\n/g, "<br />") : "";
});

// Watch for props changes to keep local model in sync
watch(
  () => props.title,
  (newVal) => {
    titleModel.value = newVal;
  }
);

watch(
  () => props.description,
  (newVal) => {
    descriptionModel.value = newVal;
  }
);
</script>

<style scoped>
.description-holder {
  position: relative;
}

.description-holder .v-btn {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
