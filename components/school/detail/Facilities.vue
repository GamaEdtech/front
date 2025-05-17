<template>
  <div>
    <div class="d-flex">
      <div class="gtext-h5 primary-gray-600">
        <div class="mb-4">Facilities</div>
        <div>
          <v-btn
            v-for="(facility, index) in displayFacilities"
            :key="index"
            :class="[
              'mr-2 mb-1',
              facility.selected
                ? 'bg-primary-gray-800 white--text'
                : 'bg-primary-gray-300 gray--text',
              ,
            ]"
            height="56"
            width="56"
          >
            <v-icon size="24"> mdi-{{ facility?.icon }} </v-icon>
          </v-btn>
        </div>
      </div>
      <v-spacer />
      <div
        @click="facilitiesDialog = true"
        class="gtext-t4 primary-blue-500 align-self-center pointer"
      >
        Contribute
      </div>
    </div>

    <v-dialog
      transition="dialog-bottom-transition"
      v-model="facilitiesDialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="720"
      style="z-index: 20001"
    >
      <v-card>
        <v-card-text class="py-6 py-md-8 px-6 px-md-8">
          <div class="d-flex">
            <div class="gtext-h5 priamry-gray-700">Facilities</div>
            <v-spacer></v-spacer>
            <v-btn icon
              ><v-icon size="20" @click="facilitiesDialog = false"
                >mdi-close</v-icon
              ></v-btn
            >
          </div>
          <v-divider class="mb-12 mt-4" />
          <v-row>
            <v-col cols="12" md="6" v-for="(tag, index) in tags" :key="index">
              <v-btn
                :class="[
                  tag.selected
                    ? 'bg-primary-gray-800 white--text'
                    : 'bg-primary-gray-300 gray--text',
                ]"
                height="56"
                width="56"
                @click="toggleTag(tag)"
              >
                <v-icon size="24"> mdi-{{ tag?.icon }} </v-icon>
              </v-btn>
              <span class="gtext-t4 ml-4 font-weight-medium">{{
                tag?.name
              }}</span>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-center pb-13">
          <v-btn
            class="primary black--text text-transform-none gtext-t4 font-weight-medium"
            rounded
            width="100%"
            max-width="400"
            x-large
            :loading="loader"
            @click="saveFacilities"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "school-facilities",
  props: {
    facilities: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tags: [],
      facilitiesDialog: false,
      selectedTags: [],
      loader: false,
    };
  },
  computed: {
    displayFacilities() {
      return this.tags.filter((tag) => tag.selected);
    },
  },
  methods: {
    async getTags() {
      await this.$axios
        .$get("/api/v2/tags/School")
        .then((res) => {
          console.log("res", res);
          this.tags = res.data.map((tag) => {
            const isSelected =
              this.facilities &&
              this.facilities.some((facility) => facility.id === tag.id);
            return {
              ...tag,
              selected: isSelected,
            };
          });

          this.selectedTags = this.tags
            .filter((tag) => tag.selected)
            .map((tag) => tag.id);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    toggleTag(tag) {
      tag.selected = !tag.selected;
      if (tag.selected) {
        this.selectedTags.push(tag.id);
      } else {
        this.selectedTags = this.selectedTags.filter((id) => id !== tag.id);
      }
      console.log("this.selectedTags", this.selectedTags);
    },

    saveFacilities() {
      this.loader = true;
      this.$axios
        .$post(
          `/api/v2/schools/${this.$route.params.id}/contributions`,
          {
            tags: this.selectedTags,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("v2_token")}`,
            },
          }
        )
        .then((response) => {
          if (response.succeeded) {
            this.$toast.success(
              "Your contribution has been successfully submitted"
            );
            this.facilitiesDialog = false;
            this.$emit("facilities-updated");
          } else {
            this.$toast.error(
              response?.errors?.[0]?.message || "Failed to update facilities"
            );
          }
          this.loader = false;
        })
        .catch((err) => {
          if (
            err.response &&
            (err.response.status === 401 || err.response.status === 403)
          ) {
            this.$emit("open-auth-dialog", "login");
            this.$toast.error("Please login to update facilities");
          } else {
            this.$toast.error("Failed to update facilities");
          }
          this.loader = false;
        });
    },
  },
  mounted() {
    this.getTags();
  },
};
</script>
