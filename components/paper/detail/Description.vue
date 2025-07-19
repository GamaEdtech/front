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
                @click="updateDetails"
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
            class="break-word"
            :class="{
              'gama-text-body1': isMobile,
              'gama-text-body2': !isMobile,
            }"
            v-show="!editMode.describe"
            v-html="formattedDescription"
          ></span>
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
                  @click="updateDetails"
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
});
const route = useRoute();
const display = useGlobalDisplay();
const isMobile = ref(false);
const isOwner = ref(false);
const emits = defineEmits(["update-success", "update-error"]);

onMounted(() => {
  isMobile.value = display.xs.value;
  watch(
    () => display.xs.value,
    (newVal) => {
      isMobile.value = newVal;
    }
  );
});

const editMode = ref({
  title: false,
  describe: false,
  title_loading: false,
  describe_loading: false,
});
const titleModel = ref(props.title);
const descriptionModel = ref(props.description);

const formattedDescription = computed(() => {
  return props.description ? props.description.replace(/\n/g, "<br />") : "";
});

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

const urlencodeFormData = (fd) => {
  var s = "";

  for (var pair of fd.entries()) {
    if (typeof pair[1] == "string") {
      s += (s ? "&" : "") + encode(pair[0]) + "=" + encode(pair[1]);
    }
  }
  return s;
};

const encode = (s) => {
  return encodeURIComponent(s).replace(/%20/g, "+");
};

const updateDetails = () => {
  editMode.value.title_loading = true;
  let formData = new FormData();
  formData.append("title", titleModel.value);
  formData.append("description", descriptionModel.value);

  useApiService
    .put(`/api/v1/tests/${route.params.slug[0]}`, urlencodeFormData(formData), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((response) => {
      if (response.data.id == 0 && response.data.repeated) {
        $toast.info("The paper is duplicated");
        emits("update-error", "The paper is duplicated");
      } else {
        $toast.success("Updated successfully");
      }
    })
    .catch((err) => {
      if (err.response.status == 403) {
        emits("update-error", "Authentication required");
      } else if (err.response.status == 400) {
        $toast.error(err.response.data.message);
        emits("update-error", err.response.data.message);
      }
    })
    .finally(() => {
      editMode.value.title = false;
      editMode.value.describe = false;
      editMode.value.title_loading = false;
    });
};
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

.break-word {
  word-break: break-word;
}
</style>
