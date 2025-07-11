<template>
  <div class="blog-create-page">
    <VeeForm ref="veeForm" @submit="onSubmit">
      <div class="d-flex flex-wrap flex-mobile">
        <v-row>
          <v-col cols="12" md="7">
            <!-- Left side - Content Editor -->
            <div class="content-editor">
              <!-- Title input -->
              <div class="title-section mb-4">
                <label class="mb-2 d-block form-label-title">Title</label>
                <Field
                  name="title"
                  :validate="validateTitleField"
                  v-slot="{ errorMessage }"
                >
                  <v-text-field
                    v-model="blog.title"
                    rounded
                    variant="outlined"
                    hide-details
                    :error="!!errorMessage"
                    :error-messages="errorMessage"
                    class="title-input"
                  >
                    <template #append-inner>
                      <div class="cursor-pointer" @click="showSlugDialog">
                        <v-icon color="#2E90FA">mdi-link</v-icon>
                      </div>
                    </template>
                  </v-text-field>
                </Field>
              </div>

              <div class="mt-10">
                <label class="mb-2 d-block form-label-title">Abstract</label>
                <v-textarea
                  rounded
                  v-model="blog.summary"
                  class="textarea-input"
                  variant="outlined"
                  placeholder="Enter here.............."
                ></v-textarea>
              </div>

              <!-- Rich text editor -->
              <div class="editor-container">
                <Field
                  name="content"
                  :validate="validateContentField"
                  v-slot="{ errorMessage }"
                >
                  <label class="mb-2 d-block form-label-title">Main</label>
                  <div class="w-100 overflow-hidden relative">
                    <ClientOnly>
                      <rich-editor-content v-model="blog.content" />
                    </ClientOnly>
                  </div>
                  <div v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                  </div>
                </Field>
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
                  :disabled="!meta.valid"
                >
                  Publish
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
                    :disabled="!meta.valid"
                    color="#FFC107"
                    class="px-6 mobile-full d-none d-md-block flex-grow-1 mr-6"
                    rounded
                    >Publish</v-btn
                  >

                  <v-btn
                    icon
                    color="#344054"
                    small
                    variant="text"
                    class="mobile-mb-2"
                  >
                    <v-icon size="large">mdi-delete</v-icon>
                  </v-btn>
                </div>
                <div
                  class="d-flex align-center justify-space-between mb-3 pa-4 mobile-stack"
                >
                  <div class="primary-gray-700 font-size-16">State</div>
                  <div class="card-select-item mobile-full">
                    <v-select
                      variant="outlined"
                      dense
                      rounded
                      density="compact"
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
                      v-model="blog.visibility"
                      variant="outlined"
                      density="compact"
                      hide-details
                      rounded
                      :items="['General', 'Premium', 'Private']"
                      value="General"
                      class="rounded-select mobile-full"
                    ></v-select>
                  </div>
                </div>
                <div
                  class="d-flex align-center justify-space-between mb-3 pa-4 mobile-stack"
                >
                  <div class="primary-gray-700 font-size-16">Publish time</div>
                  <div class="card-select-item mobile-full">
                    <v-select
                      variant="outlined"
                      density="compact"
                      rounded
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
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="blog.scheduledDate"
                        label="Select date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        dense
                        variant="outlined"
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
                <v-card-title class="options-title pb-1 mt-3 primary-gray-700">
                  Category
                </v-card-title>
                <v-card-text class="pt- mt-3">
                  <div class="category-search-row">
                    <v-text-field
                      v-model="categorySearch"
                      class="category-search-input w-100"
                      placeholder="Search or add category"
                      hide-details
                      variant="outlined"
                      rounded
                      density="compact"
                      @keyup.enter="createCategory"
                    >
                      <template #append-inner>
                        <v-btn
                          class="input-enter-button"
                          size="small"
                          icon
                          variant="flat"
                          color="#FFB600"
                          :loading="categoryLoader"
                          @click="createCategory"
                        >
                          <v-icon size="small" color="#1D2939"
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
                <v-card-title class="options-title pb-1 mt-3 primary-gray-700">
                  keyword
                </v-card-title>
                <v-card-text class="pt- mt-3">
                  <div class="category-search-row">
                    <v-text-field
                      v-model="keywordSearch"
                      class="category-search-input w-100"
                      placeholder="Search or add keyword"
                      hide-details
                      variant="outlined"
                      rounded
                      density="compact"
                      @keyup.enter="createKeyword"
                    >
                      <template #append-inner>
                        <v-btn
                          icon
                          class="input-enter-button"
                          size="small"
                          depressed
                          color="#FFB600"
                          :loading="categoryLoader"
                          @click="createKeyword"
                        >
                          <v-icon size="small" color="#1D2939"
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
                        <v-icon small color="#98A2B3">mdi-close-circle </v-icon>
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
                  <Field
                    name="image"
                    :validate="validateImageField"
                    v-slot="{ errorMessage }"
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
                        variant="flat"
                        @click="triggerImageUpload"
                      >
                        {{ imagePreview ? "Change image" : "Upload image" }}
                      </v-btn>
                      <v-btn
                        icon
                        variant="text"
                        color="error"
                        @click="deleteImage(validate)"
                        :disabled="!imagePreview"
                        class="mobile-mb-2"
                        size="large"
                      >
                        <v-icon size="large" class="primary-gray-500"
                          >mdi-delete</v-icon
                        >
                      </v-btn>
                      <input
                        type="file"
                        ref="imageInput"
                        accept="image/*"
                        style="display: none"
                        @change="(e) => onImageSelected(e, validate)"
                      />
                    </div>
                    <div v-if="errorMessage" class="error-message">
                      {{ errorMessage }}
                    </div>
                  </Field>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </div>
    </VeeForm>

    <BlogSlugDialog
      v-model="slugDialog"
      :slug="slug"
      @save="onSlugSave"
      @close="closeDialog"
    />
  </div>
</template>

<script setup>
import { Form as VeeForm, Field, useForm } from "vee-validate";
import * as yup from "yup";
import BlogSlugDialog from "@/components/admin/blogs/BlogSlugDialog.vue";
import RichEditorContent from "@/components/common/RichEditor.vue";

const { $slugGenerator, $toast } = useNuxtApp();
const router = useRouter();

definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth", "user-type"],
});

// Form refs
const veeForm = ref(null);
const imageInput = ref(null);

// Form state
const categoryLoader = ref(false);
const slugDialog = ref(false);
const loading = ref(false);
const keywords = ref([]);
const blog = ref({
  title: "",
  content: "",
  summary: null,
  status: "draft",
  visibility: "General",
  publishTime: "Immediately",
  categories: [],
  image: null,
  scheduledDate: null,
});
const slug = ref("");
const imagePreview = ref(null);
const menu = ref(false);
const categories = ref([]);
const categoriesLoading = ref(true);
const categorySearch = ref("");
const keywordSearch = ref("");
let _slugDebounce = null;

// Validation schema
const validationSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  content: yup
    .string()
    .test(
      "has-content",
      "Content is required",
      (value) => !!value && value.trim() !== ""
    ),
  image: yup.mixed().required("Featured image is required"),
  categories: yup
    .array()
    .min(1, "Select at least one category")
    .required("Categories are required"),
});

// Initialize form with validation
const { handleSubmit, isSubmitting, validate, meta, resetForm } = useForm({
  validationSchema,
  initialValues: {
    title: "",
    content: "",
    summary: "",
    categories: [],
    image: null,
  },
});

// Validation functions
const validateTitleField = (value) => {
  if (!value || value.trim() === "") {
    return "Title is required";
  }
  if (value.length < 3) {
    return "Title must be at least 3 characters";
  }
  return true;
};

const validateContentField = (value) => {
  if (!value || value.trim() === "") {
    return "Content is required";
  }
  return true;
};

const validateImageField = (value) => {
  if (!value) {
    return "Featured image is required";
  }
  return true;
};

// Form submission handler
const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append("Title", blog.value.title);
    formData.append("Slug", slug.value);
    formData.append("Body", blog.value.content);
    formData.append("Summary", blog.value.summary);

    let publishDate;
    if (blog.value.publishTime === "Immediately") {
      publishDate = new Date().toISOString();
    } else if (
      blog.value.publishTime === "Schedule" &&
      blog.value.scheduledDate
    ) {
      const date = new Date(blog.value.scheduledDate);
      publishDate = date.toISOString();
    }

    formData.append("PublishDate", publishDate);
    formData.append("VisibilityType", blog.value.visibility);
    blog.value.categories.forEach((id) => formData.append("Tags[]", id));

    if (blog.value.image) {
      formData.append("Image", blog.value.image);
    }

    const response = await useApiService.post(
      "/api/v2/blogs/contributions",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response && response.succeeded) {
      $toast.success("Blog created successfully!");
      router.push("/admin/blogs");
    } else {
      $toast.error("Failed to create blog.");
    }
  } catch (e) {
    $toast.error("Failed to create blog.");
  } finally {
    loading.value = false;
  }
});

// Clear validation errors
const clearFieldValidationErrors = () => {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((element) => {
    element.style.display = "none";
  });

  const validationTexts = document.querySelectorAll('[class*="not valid"]');
  validationTexts.forEach((element) => {
    element.style.display = "none";
  });
};

// Computed
const filteredCategories = computed(() => {
  if (!categorySearch.value) return categories.value;
  return categories.value.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.value.toLowerCase())
  );
});

// Methods
const showSlugDialog = () => {
  slugDialog.value = true;
};

const closeDialog = () => {
  slugDialog.value = false;
};

const onSlugSave = (newSlug) => {
  slug.value = newSlug;
};

const triggerImageUpload = () => {
  imageInput.value.click();
};

const onImageSelected = (event, validate) => {
  const file = event.target.files[0];
  if (file) {
    blog.value.image = file;
    imagePreview.value = URL.createObjectURL(file);
    if (typeof validate === "function") validate(file);
  }
};

const deleteImage = (validate) => {
  blog.value.image = null;
  imagePreview.value = null;
  imageInput.value.value = "";
  if (typeof validate === "function") validate(null);
};

const createSlug = async () => {
  if (!blog.value.title) {
    slug.value = "";
    return "";
  }
  try {
    const response = await useApiService.get("/api/v2/blogs/slugs/generate", {
      title: blog.value.title,
    });
    if (response && response.succeeded && response.data) {
      slug.value = response.data;
      return response.data;
    } else {
      slug.value = $slugGenerator.convert(blog.value.title || "");
      return slug.value;
    }
  } catch (e) {
    slug.value = $slugGenerator.convert(blog.value.title || "");
    return slug.value;
  }
};

const createCategory = async () => {
  const name = categorySearch.value && categorySearch.value.trim();
  if (!name) {
    $toast.error("Please enter a category name.");
    return;
  }
  try {
    categoryLoader.value = true;
    const response = await useApiService.post("/api/v2/admin/tags", {
      name,
      icon: "shape-outline",
      tagType: "Post",
    });
    if (response && response.succeeded) {
      $toast.success("Category created successfully!");
      categorySearch.value = "";
      await fetchCategories();
    } else {
      $toast.error(
        response?.errors?.[0]?.message || "Failed to create category."
      );
    }
  } catch (e) {
    $toast.error("Failed to create category.");
  } finally {
    categoryLoader.value = false;
  }
};

const createKeyword = () => {
  if (!keywordSearch.value) return;
  const newKeywords = keywordSearch.value
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);
  keywords.value.push(...newKeywords);
  keywordSearch.value = "";
};

const deleteKeyword = (row, index) => {
  keywords.value.splice(index, 1);
};

const fetchCategories = async () => {
  try {
    categoriesLoading.value = true;
    const response = await useApiService.get("/api/v2/tags/Post");
    if (response && response.succeeded) {
      categories.value = response.data;
    }
  } catch (e) {
    $toast.error("Failed to load categories");
  } finally {
    categoriesLoading.value = false;
  }
};

// Watch for content changes to trigger validation
watch(
  () => blog.value.content,
  () => {
    clearFieldValidationErrors();
    validate();
  }
);

// Watch for title changes
watch(
  () => blog.value.title,
  (newTitle) => {
    if (_slugDebounce) clearTimeout(_slugDebounce);
    _slugDebounce = setTimeout(() => {
      createSlug();
    }, 500);
    validate();
  }
);

// Lifecycle
onMounted(() => {
  fetchCategories();
});
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
  /* width: 30px;
  height: 30px;
  border-radius: 30px;
  background: #ffb600;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 9px; */
  /* margin-right: -15px; */
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
