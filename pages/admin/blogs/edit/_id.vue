<template>
  <div class="blog-create-page">
    <v-row v-if="loading">
      <v-col cols="12" md="7">
        <v-skeleton-loader type="image" class="mb-6" height="600" />
      </v-col>
      <v-col cols="12" md="5">
        <v-skeleton-loader type="image" class="mb-6" height="600" />
      </v-col>
    </v-row>

    <validation-observer ref="observer" v-slot="observer" v-else>
      <form @submit.prevent="onSubmit">
        <div class="d-flex flex-wrap flex-mobile">
          <v-row>
            <v-col cols="12" md="7">
              <!-- Left side - Content Editor -->
              <div class="content-editor flex-grow-1">
                <!-- Title input -->
                <div class="title-section mb-4">
                  <label
                    class="font-weight-medium font-size-12 mb-2 d-block primary-gray-700"
                    >Title</label
                  >
                  <validation-provider
                    name="title"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="blog.title"
                      rounded
                      outlined
                      hide-details
                      :error="!!errors.length"
                      :error-messages="errors"
                      class="title-input"
                    ></v-text-field>
                  </validation-provider>
                </div>

                <!-- Rich text editor -->
                <div class="editor-container">
                  <validation-provider
                    name="content"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <client-only>
                      <template #placeholder>
                        <v-skeleton-loader
                          type="table-heading, image"
                        ></v-skeleton-loader>
                      </template>
                      <div class="w-100 overflow-hidden relative">
                        <ckeditor-nuxt
                          v-model="blog.content"
                          :config="editorConfig"
                        ></ckeditor-nuxt>
                      </div>
                      <div v-if="errors.length" class="error-message">
                        {{ errors[0] }}
                      </div>
                    </client-only>
                  </validation-provider>
                </div>

                <!-- Bottom publish button -->
                <div class="d-flex justify-center mt-6">
                  <v-btn
                    type="submit"
                    color="#FFC107"
                    class="publish-btn mobile-full"
                    height="50"
                    width="320"
                    rounded
                    :loading="loading"
                    :disabled="observer.invalid"
                  >
                    Update
                  </v-btn>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="5">
              <!-- Right side - Publishing Options -->
              <div class="publishing-options mobile-full">
                <v-card
                  class="mb-4 options-card mobile-full"
                  color="#F9FAFB"
                  flat
                >
                  <div
                    class="d-flex justify-space-between align-center pa-4 mobile-stack"
                  >
                    <v-btn icon color="error" small class="mobile-mb-2">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn
                      :loading="loading"
                      :disabled="observer.invalid"
                      color="#FFC107"
                      class="px-6 mobile-full d-none d-md-block"
                      rounded
                      >Update</v-btn
                    >
                  </div>
                  <div
                    class="d-flex align-center justify-space-between mb-3 pa-4 mobile-stack"
                  >
                    <div class="primary-gray-700 font-size-16">State</div>
                    <div class="card-select-item mobile-full">
                      <v-select
                        outlined
                        dense
                        hide-details
                        :items="['Drafted', 'Published', 'Archived']"
                        value="Drafted"
                        class="rounded-select mobile-full"
                      ></v-select>
                    </div>
                  </div>
                  <div
                    class="d-flex align-center justify-space-between mb-3 pa-4 mobile-stack"
                  >
                    <div class="primary-gray-700 font-size-16">Visibility</div>
                    <div class="card-select-item mobile-full">
                      <v-select
                        outlined
                        dense
                        hide-details
                        :items="['General', 'Premium', 'Private']"
                        value="General"
                        class="rounded-select mobile-full"
                      ></v-select>
                    </div>
                  </div>
                  <div
                    class="d-flex align-center justify-space-between mb-3 pa-4 mobile-stack"
                  >
                    <div class="primary-gray-700 font-size-16">
                      Publish time
                    </div>
                    <div class="card-select-item mobile-full">
                      <v-select
                        outlined
                        dense
                        hide-details
                        :items="['Immediately', 'Schedule']"
                        v-model="blog.publishTime"
                        class="rounded-select mobile-full"
                      ></v-select>
                    </div>
                  </div>
                  <div v-if="blog.publishTime === 'Schedule'" class="px-4 pb-4">
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="blog.scheduledDate"
                          label="Select date"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          dense
                          outlined
                          hide-details
                          class="rounded-select mobile-full"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="blog.scheduledDate"
                        @input="menu = false"
                      ></v-date-picker>
                    </v-menu>
                  </div>
                </v-card>

                <v-card
                  class="mb-4 options-card mobile-full"
                  color="#F9FAFB"
                  flat
                >
                  <v-card-title class="options-title pb-1 mt-3 primary-gray-700"
                    >Category</v-card-title
                  >
                  <v-card-text class="pt- mt-3">
                    <div class="category-options">
                      <template v-if="categoriesLoading">
                        <v-skeleton-loader
                          type="list-item-two-line"
                        ></v-skeleton-loader>
                      </template>
                      <template v-else>
                        <v-checkbox
                          v-for="cat in categories"
                          :key="cat.id"
                          v-model="blog.categories"
                          :label="cat.name"
                          :value="cat.id"
                          hide-details
                          class="category-checkbox"
                          dense
                        ></v-checkbox>
                      </template>
                      <div class="add-category mt-4">
                        <v-icon color="#1e88e5" small class="mr-1"
                          >mdi-plus-circle</v-icon
                        >
                        <span class="add-category-text">Add new category</span>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>

                <v-card class="options-card mobile-full" color="#F9FAFB" flat>
                  <v-card-title class="options-title pb-4 mt-3 primary-gray-700"
                    >Index image</v-card-title
                  >
                  <v-card-text class="pt-0">
                    <validation-provider
                      name="image"
                      :value="blog.image"
                      v-slot="{ errors, validate }"
                    >
                      <div class="image-preview mb-2" v-if="imagePreview">
                        <img
                          :src="imagePreview"
                          alt="Index image"
                          class="preview-image"
                        />
                      </div>
                      <div class="d-flex justify-space-between mobile-stack">
                        <v-btn
                          icon
                          color="error"
                          @click="deleteImage(validate)"
                          :disabled="!imagePreview"
                          class="mobile-mb-2"
                        >
                          <v-icon class="primary-gray-500">mdi-delete</v-icon>
                        </v-btn>
                        <v-btn
                          color="white"
                          class="black--text px-6 mobile-full"
                          rounded
                          @click="triggerImageUpload"
                        >
                          {{ imagePreview ? "Change image" : "Upload image" }}
                        </v-btn>
                        <input
                          type="file"
                          ref="imageInput"
                          accept="image/*"
                          style="display: none"
                          @change="(e) => onImageSelected(e, validate)"
                        />
                      </div>
                      <div v-if="errors.length" class="error-message">
                        {{ errors[0] }}
                      </div>
                    </validation-provider>
                  </v-card-text>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </div>
      </form>
    </validation-observer>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
extend("required", {
  validate: (value) => {
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
  },
  message: "This field is required",
});
export default {
  auth: false,
  layout: "admin",
  components: {
    ValidationObserver,
    ValidationProvider,
    "ckeditor-nuxt": () => {
      if (process.client) {
        return import("@blowstack/ckeditor-nuxt");
      }
    },
  },
  data() {
    return {
      loading: true,
      blog: {
        title: "",
        content: null,
        status: "draft",
        visibility: "General",
        publishTime: "Immediately",
        categories: [],
        image: null,
        scheduledDate: null,
      },
      imagePreview: null,
      menu: false,
      editorConfig: {
        width: "auto",
        title: false,
        removePlugins: ["Title"],
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "|",
          "indent",
          "outdent",
          "|",
          "imageUpload",
          "blockQuote",
          "insertTable",
          "mediaEmbed",
          "undo",
          "redo",
        ],
        language: "en",
        image: {
          toolbar: [
            "imageTextAlternative",
            "imageStyle:full",
            "imageStyle:side",
          ],
        },
      },
      categories: [],
      categoriesLoading: true,
    };
  },
  async mounted() {
    await this.fetchBlog();
    await this.fetchCategories();
  },
  methods: {
    async fetchBlog() {
      this.loading = true;
      try {
        const postId = this.$route.params.id;
        const response = await this.$axios.$get(
          `/api/v2/blogs/posts/${postId}`,
          {
            params: { postId },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("v2_token")}`,
            },
          }
        );
        if (response && response.succeeded && response.data) {
          this.blog.title = response.data.title || "";
          this.blog.content = response.data.body || "";
          this.blog.image = null;
          this.imagePreview = response.data.imageUri || null;
          await this.$nextTick();
          if (this.$refs.observer) {
            this.$refs.observer.validate();
          }
        }
      } finally {
        this.loading = false;
      }
    },
    async fetchCategories() {
      try {
        const response = await this.$axios.$get("/api/v2/tags/Post");
        if (response && response.succeeded) {
          this.categories = response.data;
        }
      } catch (e) {
        this.$toast && this.$toast.error("Failed to load categories");
      } finally {
        this.categoriesLoading = false;
      }
    },
    triggerImageUpload() {
      this.$refs.imageInput.click();
    },
    onImageSelected(event, validate) {
      const file = event.target.files[0];
      if (file) {
        this.blog.image = file;
        this.imagePreview = URL.createObjectURL(file);
        if (typeof validate === "function") validate(file);
      }
    },
    deleteImage(validate) {
      this.blog.image = null;
      this.imagePreview = null;
      this.$refs.imageInput.value = "";
      if (typeof validate === "function") validate(null);
    },
    async onSubmit() {
      this.loading = true;
      const formData = new FormData();
      formData.append("Title", this.blog.title);
      formData.append("Slug", this.blog.title);
      formData.append("Body", this.blog.content);
      formData.append(
        "Summary",
        this.blog.content ? this.blog.content.substring(0, 120) : ""
      );
      let publishDate;
      if (this.blog.publishTime === "Immediately") {
        publishDate = new Date().toISOString();
      } else if (
        this.blog.publishTime === "Schedule" &&
        this.blog.scheduledDate
      ) {
        const date = new Date(this.blog.scheduledDate);
        publishDate = date.toISOString();
      }
      formData.append("PublishDate", publishDate);
      formData.append("VisibilityType", this.blog.visibility);
      this.blog.categories.forEach((id) => formData.append("Tags[]", id));
      if (this.blog.image) {
        formData.append("Image", this.blog.image);
      }
      try {
        // TODO: Replace with the correct update endpoint and method
        // const response = await this.$axios.$put(`/api/v2/blogs/contributions/${this.$route.params.id}`, formData, { ... });
        // if (response && response.succeeded) { ... }
        this.$toast && this.$toast.success("Blog updated (mock)");
      } catch (e) {
        this.$toast && this.$toast.error("Failed to update blog.");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
@media (max-width: 900px) {
  .blog-create-page {
    padding: 8px;
  }
  .d-flex.flex-wrap.flex-mobile {
    flex-direction: column !important;
    gap: 0;
  }
  .content-editor,
  .publishing-options {
    /* width: 100% !important;
    max-width: 100% !important;
    margin-left: 0 !important; */
  }
  .ml-4 {
    margin-left: 0 !important;
  }
  .mobile-full {
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    box-sizing: border-box;
  }
  .mobile-stack {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 8px;
  }
  .mobile-mb-2 {
    margin-bottom: 12px !important;
  }
  .preview-image {
    height: 90px !important;
  }
}

.card-select-item {
  width: 150px;
}
.blog-create-page {
  padding: 20px;
}

.title-input {
  font-size: 18px;
}

.editor-container {
  margin-bottom: 20px;
}

/* Increase editor height */
.editor-container :deep(.ck-editor__editable) {
  min-height: 250px !important;
}

/* Style the editor toolbar and content area */
.editor-container :deep(.ck-toolbar) {
  border-radius: 8px 8px 0 0;
}

.editor-container :deep(.ck-content) {
  border-radius: 0 0 8px 8px;
}

.publish-btn {
  text-transform: none;
  font-weight: 500;
  font-size: 16px;
}

.options-card {
  border-radius: 16px;
  overflow: hidden;
}

.rounded-select >>> .v-input__slot {
  border-radius: 20px !important;
  background-color: white !important;
}

.options-title {
  font-size: 16px !important;
  font-weight: 500 !important;
  color: #344054;
}

.category-options {
  padding-top: 6px;
}

.category-checkbox {
  margin-top: 0;
  margin-bottom: 0;
}

.add-category {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.add-category-text {
  color: #1e88e5;
  font-size: 14px;
}

.preview-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

.error-message {
  color: #e53935;
  font-size: 13px;
  margin-top: 9px;
}
</style>
