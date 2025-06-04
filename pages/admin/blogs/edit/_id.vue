<template>
  <div class="blog-create-page">
    <validation-observer ref="observer" v-slot="observer" v-if="!loading">
      <form @submit.prevent="onSubmit">
        <div class="d-flex flex-wrap flex-mobile">
          <v-row>
            <v-col cols="12" md="7">
              <!-- Left side - Content Editor -->
              <div class="content-editor">
                <!-- Title input -->
                <div class="title-section mb-4">
                  <label class="mb-2 d-block form-label-title">Title</label>
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
                    >
                      <template slot="append">
                        <div class="cursor-pointer" @click="showSlugDialog">
                          <v-icon color="#2E90FA" v-text="'mdi-link'"></v-icon>
                        </div>
                      </template>
                    </v-text-field>
                  </validation-provider>
                </div>

                <div class="mt-10">
                  <label class="mb-2 d-block form-label-title">Abstract</label>
                  <v-textarea
                    v-model="blog.summary"
                    class="textarea-input"
                    outlined
                    placeholder="Enter here.............."
                  ></v-textarea>
                </div>

                <!-- Rich text editor -->
                <div class="editor-container">
                  <validation-provider
                    name="content"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <label class="mb-2 d-block form-label-title">Main </label>
                    <div class="w-100 overflow-hidden relative">
                      <ClientOnly>
                        <rich-editor v-model="blog.content" />
                      </ClientOnly>
                    </div>
                    <div v-if="errors.length" class="error-message">
                      {{ errors[0] }}
                    </div>
                  </validation-provider>
                </div>

                <!-- Bottom publish button -->
                <div class="d-flex justify-start mt-6">
                  <v-btn
                    type="submit"
                    color="#FFC107"
                    class="publish-btn mobile-full"
                    height="50"
                    width="320"
                    rounded
                    :loading="loading"
                    :disabled="observer.invalid || !observer.validated"
                  >
                    Save
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
                    <v-btn
                      type="submit"
                      :loading="loading"
                      :disabled="observer.invalid || !observer.validated"
                      color="#FFC107"
                      class="px-6 mobile-full d-none d-md-block flex-grow-1 mr-6"
                      rounded
                      >Save</v-btn
                    >
                    <v-btn icon color="#344054" small class="mobile-mb-2">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
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
                        v-model="blog.status"
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
                        v-model="blog.visibility"
                        outlined
                        dense
                        hide-details
                        :items="['General', 'Premium', 'Private']"
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
                  class="mb-4 options-card mobile-full category-card"
                  color="#F9FAFB"
                  flat
                >
                  <v-card-title
                    class="options-title pb-1 mt-3 primary-gray-700"
                  >
                    Category
                  </v-card-title>
                  <v-card-text class="pt- mt-3">
                    <div class="category-search-row">
                      <v-text-field
                        v-model="categorySearch"
                        class="category-search-input w-100"
                        placeholder="Search or add category"
                        hide-details
                        outlined
                        rounded
                        dense
                        @keyup.enter="createCategory"
                      >
                        <template slot="append">
                          <v-btn
                            class="input-enter-button"
                            fab
                            small
                            depressed
                            color="#FFB600"
                            :loading="categoryLoader"
                            @click="createCategory"
                          >
                            <v-icon small color="#1D2939"
                              >mdi-subdirectory-arrow-left
                            </v-icon>
                          </v-btn>
                        </template>
                      </v-text-field>
                    </div>
                    <div class="category-options-list">
                      <template v-if="categoriesLoading">
                        <v-skeleton-loader
                          type="list-item-two-line"
                        ></v-skeleton-loader>
                      </template>
                      <template v-else>
                        <v-checkbox
                          v-for="cat in filteredCategories"
                          :key="cat.id"
                          v-model="blog.categories"
                          :label="cat.name"
                          :value="cat.id"
                          hide-details
                          class="category-checkbox"
                          dense
                        ></v-checkbox>
                      </template>
                    </div>
                  </v-card-text>
                </v-card>

                <v-card
                  class="mb-4 options-card mobile-full category-card"
                  color="#F9FAFB"
                  flat
                >
                  <v-card-title
                    class="options-title pb-1 mt-3 primary-gray-700"
                  >
                    keyword
                  </v-card-title>
                  <v-card-text class="pt- mt-3">
                    <div class="category-search-row">
                      <v-text-field
                        v-model="keywordSearch"
                        class="category-search-input w-100"
                        placeholder="Search or add keyword"
                        hide-details
                        outlined
                        rounded
                        dense
                        @keyup.enter="createKeyword"
                      >
                        <template slot="append">
                          <v-btn
                            class="input-enter-button"
                            fab
                            small
                            depressed
                            color="#FFB600"
                            :loading="categoryLoader"
                            @click="createKeyword"
                          >
                            <v-icon small color="#1D2939"
                              >mdi-subdirectory-arrow-left
                            </v-icon>
                          </v-btn>
                        </template>
                      </v-text-field>
                    </div>
                    <div class="search-hint-label mt-3 mb-7">
                      You can also use commas
                    </div>

                    <div class="d-flex flex-wrap align-center">
                      <div
                        class="keyword-item mr-1 mb-2"
                        v-for="(kitem, index) in keywords"
                        :key="index"
                      >
                        <div class="keyword-item__title">{{ kitem }}</div>
                        <div
                          class="keyword-item__icon cursor-pointer"
                          @click="deleteKeyword(kitem, index)"
                        >
                          <v-icon small color="#98A2B3"
                            >mdi-close-circle
                          </v-icon>
                        </div>
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
                      rules="required"
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
                          color="white"
                          class="black--text px-6 mobile-full upload-btn"
                          rounded
                          depressed
                          @click="triggerImageUpload"
                        >
                          {{ imagePreview ? "Change image" : "Upload image" }}
                        </v-btn>
                        <v-btn
                          icon
                          color="error"
                          @click="deleteImage(validate)"
                          :disabled="!imagePreview"
                          class="mobile-mb-2"
                        >
                          <v-icon class="primary-gray-500">mdi-delete</v-icon>
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

    <v-row v-else>
      <v-col cols="12" md="7">
        <v-skeleton-loader type="image" class="mb-6" height="600" />
      </v-col>
      <v-col cols="12" md="5">
        <v-skeleton-loader type="image" class="mb-6" height="600" />
      </v-col>
    </v-row>
    <BlogSlugDialog v-model="slugDialog" :slug="slug" @save="onSlugSave" />
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import RichEditor from "@/components/RichEditor.vue";
import BlogSlugDialog from "@/components/admin/blogs/BlogSlugDialog.vue";
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
    RichEditor,
    BlogSlugDialog,
  },
  data() {
    return {
      categoryLoader: false,
      loading: false,
      keywords: [],
      blog: {
        title: "",
        content: "",
        summary: null,
        status: "Drafted",
        visibility: "General",
        publishTime: "Immediately",
        categories: [],
        image: null,
        scheduledDate: null,
      },
      slug: "",
      slugDialog: false,
      imagePreview: null,
      menu: false,
      categories: [],
      categoriesLoading: true,
      categorySearch: "",
      keywordSearch: "",
    };
  },
  computed: {
    filteredCategories() {
      if (!this.categorySearch) return this.categories;
      return this.categories.filter((cat) =>
        cat.name.toLowerCase().includes(this.categorySearch.toLowerCase())
      );
    },
  },
  watch: {
    "blog.title"(newTitle) {
      this.slug = this.$slugGenerator.convert(newTitle || "");
    },
  },
  methods: {
    showSlugDialog() {
      this.slugDialog = true;
    },
    onSlugSave(newSlug) {
      this.slug = newSlug;
    },
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
          this.blog.summary = response.data.summary || null;
          this.blog.status = response.data.status || "Drafted";
          this.blog.visibility = response.data.visibility || "General";
          this.blog.publishTime = response.data.publishTime || "Immediately";
          this.blog.categories = response.data.categories || [];
          this.blog.scheduledDate = response.data.scheduledDate || null;
          this.blog.image = null;
          this.imagePreview = response.data.imageUri || null;
          this.slug =
            response.data.slug ||
            this.$slugGenerator.convert(this.blog.title || "");
          await this.$nextTick();
          if (this.$refs.observer) {
            this.$refs.observer.validate();
          }
        }
      } finally {
        this.loading = false;
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
    async createCategory() {
      const name = this.categorySearch && this.categorySearch.trim();
      if (!name) {
        this.$toast.error("Please enter a category name.");
        return;
      }
      try {
        this.categoryLoader = true;
        const response = await this.$axios.$post(
          "/api/v2/admin/tags",
          {
            name,
            icon: "shape-outline",
            tagType: "Post",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("v2_token")}`,
            },
          }
        );
        if (response && response.succeeded) {
          this.$toast.success("Category created successfully!");
          this.categorySearch = "";
          await this.fetchCategories();
        } else {
          this.$toast.error(
            response?.errors?.[0]?.message || "Failed to create category."
          );
        }
        this.categoryLoader = false;
      } catch (e) {
        this.categoryLoader = false;
        this.$toast.error("Failed to create category.");
      }
    },
    async createKeyword() {
      if (!this.keywordSearch) return;
      // Split by comma, trim, and filter out empty
      const newKeywords = this.keywordSearch
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
      this.keywords.push(...newKeywords);
      this.keywordSearch = "";
    },
    async deleteKeyword(row, index) {
      this.keywords.splice(index, 1);
    },
    async onSubmit() {
      this.loading = true;
      const formData = new FormData();
      formData.append("Title", this.blog.title);
      formData.append("Slug", this.slug);
      formData.append("Body", this.blog.content);
      formData.append("Summary", this.blog.summary);
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
        const response = await this.$axios.$put(
          `/api/v2/blogs/contributions/${this.$route.params.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("v2_token")}`,
            },
          }
        );
        if (response && response.succeeded) {
          this.$toast.success("Blog updated successfully!");
          this.$router.push("/admin/blogs");
        } else {
          this.$toast.error("Failed to update blog.");
        }
        this.loading = false;
      } catch (e) {
        this.$toast.error("Failed to update blog.");
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchBlog();
    this.fetchCategories();
  },
};
</script>

<style scoped>
.upload-btn {
  border: 1px solid #e4e7ec !important;
}
.keyword-item {
  background: #1d2939;
  color: #fcfcfd;
  font-size: 12px;
  font-weight: 400;
  width: 73px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  padding: 11px 9px;
}
.search-hint-label {
  color: #98a2b3;
  font-size: 14px;
  font-weight: 400;
}
.input-enter-button {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background: #ffb600;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 9px;
  margin-right: -15px;
}
.form-label-title {
  color: #344054;
  font-size: 20px;
  font-weight: 600;
}
.textarea-input {
  border-radius: 16px !important;
}
@media (max-width: 900px) {
  .blog-create-page {
    padding: 8px;
  }
  .d-flex.flex-wrap.flex-mobile {
    flex-direction: column !important;
    gap: 0;
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
  border-radius: 16px !important;
}

.editor-container {
  margin-bottom: 20px;
}

.editor-container :deep(.ck-editor__editable) {
  min-height: 250px !important;
}

.editor-container :deep(.ck-toolbar) {
  border-radius: 8px 8px 0 0;
}

.editor-container :deep(.ck-content) {
  border-radius: 0 0 8px 8px;
}

.editor-toolbar {
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  padding: 6px 16px;
}

.editor-menu-item {
  font-size: 14px;
  margin-right: 16px;
  cursor: pointer;
}

.toolbar-buttons {
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9f9f9;
}

.heading-toolbar {
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9f9f9;
}

.heading-select,
.style-select {
  max-width: 150px;
}

.editor-content {
  min-height: 400px;
  background-color: #ffffff;
}

.editor-placeholder {
  color: #9e9e9e;
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

.category-search-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.category-search-input {
  min-width: 100%;
  flex: 1;
  border-radius: 24px !important;
  background: #fff !important;
  margin-right: 8px;
}
.category-search-btn {
  border-radius: 50% !important;
  min-width: 44px !important;
  width: 44px !important;
  height: 44px !important;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.category-options-list {
  background: #fff;
  border-radius: 16px;
  padding: 16px 0;
  max-height: 180px;
  overflow-y: auto;
  margin-bottom: 8px;
}
.category-checkbox {
  margin: 0 0 8px 0;
  padding-left: 16px;
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
