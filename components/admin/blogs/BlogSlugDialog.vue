<template>
  <v-dialog
    transition="dialog-bottom-transition"
    v-model="dialogVisible"
    max-width="780"
    class="toast-dialog-notif"
  >
    <v-card>
      <v-card-text class="px-0 py-0">
        <div class="py-6 py-md-1 px-4">
          <div class="d-flex justify-space-between align-center">
            <div class="gtext-h5 primary-gray-700"></div>
            <v-btn icon @click="closeDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>

          <div class="">
            <div class="d-flex align-center justify-center">
              <div class="report-icon-alert">
                <v-icon size="60" color="primary" class="">mdi-link</v-icon>
              </div>
            </div>
            <div
              class="mt-4 primary-gray-700 font-weight-bold font-size-18 text-center"
            >
              You can change slug
            </div>
          </div>
        </div>

        <div class="mt-6 bg-primary-gray-100 px-6 pb-3 pt-7">
          <div class="w-md-80 mx-md-auto">
            <v-textarea
              class="dialog-input"
              background-color="white"
              v-model="localSlug"
              outlined
              placeholder="Enter The Slug..."
              :rules="[(v) => v.length >= 4 || 'Enter at least 4 characters.']"
              persistent-hint
              rows="2"
            ></v-textarea>
          </div>
        </div>

        <v-card-actions class="bg-primary-gray-100 pt-2 pb-4">
          <div class="w-md-50 w-80 mx-auto d-flex justify-center">
            <v-btn
              block
              rounded
              color="primary"
              :disabled="!localSlug || localSlug.length < 4"
              :loading="submitLoader"
              @click="saveSlug"
            >
              Save
            </v-btn>
          </div>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "BlogSlugDialog",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      localSlug: this.slug,
      submitLoader: false,
    };
  },
  watch: {
    slug(newVal) {
      this.localSlug = newVal;
    },
    value(val) {
      if (val) this.localSlug = this.slug;
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
    },
    saveSlug() {
      if (!this.localSlug || this.localSlug.length < 4) {
        this.$toast.error("Enter at least 4 characters for the slug.");
        return;
      }
      this.submitLoader = true;
      this.$emit("save", this.localSlug);
      this.dialogVisible = false;
      this.submitLoader = false;
    },
  },
};
</script>

<style scoped>
.report-icon-alert {
  background: #f2f4f7;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
.dialog-input {
  border-radius: 16px !important;
}
.dialog-input .v-input__slot {
  border-color: #e4e7ec !important;
}
</style>
