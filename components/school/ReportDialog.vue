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
              <img
                :src="require('@/assets/images/issue-warning.png')"
                alt=""
                class=""
                width="80"
              />
            </div>
            <div
              class="mt-4 primary-gray-700 font-weight-bold font-size-18 text-center"
            >
              Report Form
            </div>
          </div>
        </div>

        <div class="mt-4 bg-primary-gray-100 px-6 pb-3 pt-7">
          <div class="w-md-70 mx-md-auto">
            <div class="mb-3 primary-gray-900 font-size-16">Description</div>
            <v-textarea
              background-color="white"
              v-model="reportForm.description"
              outlined
              placeholder="Enter here..."
              :rules="[
                (v) => v.length >= 25 || 'Enter at least 25 characters.',
              ]"
              hint="Enter at least 25 characters."
              persistent-hint
              rows="5"
            ></v-textarea>
          </div>
        </div>

        <v-card-actions class="bg-primary-gray-100 py-5">
          <div class="w-md-50 w-80 mx-auto d-flex justify-center">
            <v-btn
              block
              rounded
              color="primary"
              :disabled="
                !reportForm.description || reportForm.description.length < 25
              "
              :loading="reportSubmitLoader"
              @click="submitReport"
            >
              Send
            </v-btn>
          </div>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ReportDialog",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    schoolId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      reportForm: {
        description: "",
      },
      reportSubmitLoader: false,
    };
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
    submitReport() {
      // Validate input
      if (
        !this.reportForm.description ||
        this.reportForm.description.length < 25
      ) {
        this.$toast.error(
          "Please provide a description with at least 25 characters"
        );
        return;
      }

      this.reportSubmitLoader = true;

      const reportData = {
        description: this.reportForm.description,
      };

      this.$axios
        .$post(`/api/v2/schools/${this.schoolId}/issues`, reportData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("v2_token")}`,
          },
        })
        .then((response) => {
          if (response.succeeded) {
            this.$toast.success("Thanks for your report!");
            this.dialogVisible = false;
            this.reportForm.description = "";
          } else {
            this.$toast.error(
              response?.errors?.[0]?.message ||
                "Something went wrong, please try again."
            );
          }
        })
        .catch((err) => {
          if (
            err.response &&
            (err.response.status === 401 || err.response.status === 403)
          ) {
            this.$emit("open-auth-dialog", "login");
            this.$toast.error("Please login to submit a report");
          } else {
            this.$toast.error("Something went wrong, please try again.");
          }
          console.error("Error submitting report:", err);
        })
        .finally(() => {
          this.reportSubmitLoader = false;
        });
    },
  },
};
</script>

<style scoped></style>
