<template>
  <div>
    <!-- Tabs and action buttons -->
    <div
      class="d-flex align-center justify-space-between mb-4 header-responsive"
    >
      <div class="d-flex align-center tabs-responsive">
        <v-bottom-navigation v-model="activeTab" class="bar">
          <v-btn
            v-for="tab in ['Published', 'Drafted', 'Deleted']"
            :key="tab"
            :value="tab"
            :class="{ 'active-btn': activeTab == tab }"
            class="rounded-pill"
          >
            <span>{{ tab }}</span>
          </v-btn>
        </v-bottom-navigation>
      </div>
      <div class="d-flex align-center actions-responsive">
        <div class="mr-10 mb-2 new-blog-btn-wrap">
          <v-btn
            :to="`/admin/blogs/create`"
            color="success"
            rounded
            class="ml-md-4 new-blog-btn"
          >
            <v-icon small left>mdi-plus</v-icon> New blog
          </v-btn>
        </div>
        <v-text-field
          placeholder="Search anything..."
          prepend-inner-icon="mdi-magnify"
          dense
          rounded
          outlined
          hide-details
          class="search-input mr-4"
        ></v-text-field>
        <div class="item-count">{{ totalRecords }} Item</div>
      </div>
    </div>

    <!-- Table -->
    <v-card flat class="blog-table-container">
      <v-data-table
        :headers="headers"
        :items="tableItems"
        :items-per-page="-1"
        hide-default-footer
        disable-pagination
        show-select
        v-model="selected"
        class="blog-table"
        item-key="id"
        :loading="loading"
      >
        <template v-slot:item.title="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="40" class="mr-3">
              <img :src="item.avatar" alt="avatar" />
            </v-avatar>
            <span class="blog-title">{{ item.title }}</span>
          </div>
        </template>

        <template v-slot:item.category="{ item }">
          <div class="category-badge">
            <v-icon small v-if="item.category === 'News'" class="mr-1">
              mdi-file-document-outline
            </v-icon>
            <v-icon small v-else class="mr-1">mdi-bullhorn-outline</v-icon>
            {{ item.category }}
          </div>
        </template>

        <template v-slot:item.edit="{ item }">
          <v-btn
            :to="`/admin/blogs/edit/${item?.id}`"
            icon
            small
            color="primary"
          >
            <v-icon small class="primary-gray-500">mdi-pencil</v-icon>
          </v-btn>
        </template>

        <template v-slot:item.delete="{ item }">
          <v-btn icon small color="error" @click="openDeleteModal(item)">
            <v-icon small class="primary-gray-500">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Footer with pagination -->
    <div
      class="d-flex justify-space-between align-center mt-4 footer-responsive"
    >
      <div class="d-flex align-center bulk-action-responsive">
        <v-select
          outlined
          dense
          rounded
          hide-details
          class="mr-2 bulk-action-select"
          :items="['Delete All', 'Move to Draft']"
          placeholder="Delete All"
          :disabled="!selected.length"
        ></v-select>
        <v-btn
          :disabled="!selected.length"
          rounded
          color="#344054"
          class="do-btn"
          ><span class="text-white">Do</span></v-btn
        >
      </div>
      <div class="pagination-responsive">
        <v-pagination
          next-icon="mdi-arrow-right"
          prev-icon="mdi-arrow-left"
          v-model="page"
          :length="Math.ceil(totalRecords / pageSize) || 1"
          :total-visible="7"
          class="custom-pagination"
        ></v-pagination>
      </div>
      <div class="d-flex align-center row-select-responsive">
        <v-select
          v-model="perPage"
          :items="['10 Row', '20 Row', '50 Row']"
          dense
          outlined
          hide-details
          class="ml-md-4 row-select"
          rounded
        ></v-select>
      </div>
    </div>

    <!-- Delete Modal -->
    <deleteItemModalVue
      :isOpen.sync="isDeleteModalOpen"
      :itemType="'blog'"
      @confirm="handleDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>

<script>
import deleteItemModalVue from "@/components/modals/deleteItemModal.vue";

export default {
  auth: false,
  layout: "admin",
  components: {
    deleteItemModalVue,
  },
  data() {
    return {
      singleSelect: false,
      selected: [],
      activeTab: "Published",
      page: 1,
      pageSize: 10,
      perPage: "10 Row",
      totalRecords: 0,
      headers: [
        { text: "All", value: "data-table-select", sortable: false },
        { text: "Name", value: "title" },
        { text: "Category", value: "category", sortable: true },
        { text: "Author", value: "author", sortable: true },
        { text: "Date", value: "date", sortable: true },
        { text: "Edit", value: "edit", sortable: false },
        { text: "Delete", value: "delete", sortable: false },
      ],
      tableItems: [],
      isDeleteModalOpen: false,
      itemToDelete: null,
      loading: false,
    };
  },
  watch: {
    page(val) {
      this.fetchBlogs();
    },
    perPage(val) {
      this.pageSize = parseInt(val);
      this.page = 1;
      this.fetchBlogs();
    },
  },
  mounted() {
    this.fetchBlogs();
  },
  methods: {
    async fetchBlogs() {
      this.loading = true;
      const skip = (this.page - 1) * this.pageSize;
      try {
        const response = await this.$axios.$get("/api/v2/blogs/posts", {
          params: {
            "PagingDto.PageFilter.Size": this.pageSize,
            "PagingDto.PageFilter.Skip": skip,
            "PagingDto.PageFilter.ReturnTotalRecordsCount": true,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("v2_token")}`,
          },
        });
        if (response && response.succeeded) {
          this.tableItems = (response.data.list || []).map((item) => ({
            id: item.id,
            title: item.title,
            category: item.category || "",
            author: item.author || "",
            date: item.date || "",
            avatar: item.imageUri || "",
            summary: item.summary || "",
          }));
          this.totalRecords = response.data.totalRecordsCount || 0;
        }
      } finally {
        this.loading = false;
      }
    },
    openDeleteModal(item) {
      this.itemToDelete = item;
      this.isDeleteModalOpen = true;
    },
    async handleDelete() {
      if (this.itemToDelete) {
        try {
          await this.$axios.$delete(
            `/api/v2/blogs/posts/${this.itemToDelete.id}`,
            {
              data: { postId: this.itemToDelete.id },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("v2_token")}`,
              },
            }
          );
          this.$toast.success("Blog deleted successfully!");
          this.tableItems = this.tableItems.filter(
            (item) => item.id !== this.itemToDelete.id
          );
        } catch (e) {
          this.$toast.error("Failed to delete blog.");
        }
      }
      this.itemToDelete = null;
      this.isDeleteModalOpen = false;
    },
  },
};
</script>

<style scoped>
@media (max-width: 600px) {
  .header-responsive {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 12px;
  }
  .tabs-responsive {
    justify-content: center !important;
    margin-bottom: 8px;
  }
  .actions-responsive {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 8px;
  }
  .new-blog-btn-wrap {
    margin-right: 0 !important;
    margin-bottom: 8px !important;
  }
  .new-blog-btn,
  .search-input {
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    box-sizing: border-box;
  }
  .item-count {
    margin-top: 8px;
    margin-bottom: 8px;
    text-align: right;
  }
  .footer-responsive {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 0;
    margin-bottom: 16px;
  }
  .bulk-action-responsive {
    width: 100% !important;
    justify-content: stretch !important;
    margin-bottom: 12px;
    flex-direction: column !important;
    gap: 8px;
  }
  .bulk-action-select,
  .do-btn {
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    box-sizing: border-box;
    margin-bottom: 8px;
  }
  .pagination-responsive {
    width: 100% !important;
    display: flex;
    justify-content: center !important;
    margin-bottom: 12px;
    background: #fff;
    border-radius: 18px;
    padding: 10px 0 6px 0;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  }
  .custom-pagination {
    width: 100% !important;
    justify-content: center !important;
  }
  .row-select-responsive {
    width: 100% !important;
    margin-bottom: 0;
  }
  .row-select {
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    box-sizing: border-box;
  }
}

/* Tab styles */
.tab-buttons {
  display: flex;
}

.active-btn {
  background-color: #ffb600 !important;
  color: black !important;
}

.bar {
  box-shadow: none;
  background-color: #f9fafb;
  width: 254px;
  height: 45px !important;
  border-radius: 50px;
}
.border {
  color: #e4e7ec;
  padding: 0 14px;
  width: 360px;
  height: 40px;
  border-radius: 50px;
}

.new-blog-btn {
  text-transform: none;
  font-weight: 600;
}

.search-input {
  max-width: 300px;
}

.item-count {
  color: #bdbdbd;
  font-size: 14px;
}

/* Table styles */
.blog-table-container {
  border-radius: 8px;
  overflow: hidden;
}

.blog-table {
  width: 100%;
  border-collapse: collapse;
}

.blog-table >>> .v-data-table-header {
  background: #f8f9fa;
}

.blog-table >>> .v-data-table-header th {
  color: #344054 !important;
  font-weight: 600 !important;
  text-align: left;
  padding: 12px 16px;
  font-size: 14px;
  border-bottom: 1px solid #e0e0e0;
  text-transform: none;
  letter-spacing: normal;
}

.blog-table >>> tbody tr {
  border-bottom: 1px solid #f2f4f7;
}

.blog-table >>> tbody td {
  padding: 12px 16px;
  font-size: 14px;
  color: #333;
}

.blog-table >>> .v-data-table__checkbox {
  margin-right: 8px;
}

.blog-title {
  font-weight: 500;
}

.category-badge {
  display: flex;
  align-items: center;
  color: #666;
}

.row-select {
  max-width: 120px;
  border-radius: 20px;
}

.bulk-action-select {
  max-width: 150px;
}

.do-btn {
  min-width: 60px;
  text-transform: none;
}
</style>
