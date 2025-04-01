<template>
  <div>
    <!-- Filters & Actions -->
    <div class="d-flex align-center justify-between mb-4">
      <div class="d-flex head">
        <v-bottom-navigation v-model="value" class="bar">
          <v-btn
            v-for="tab in ['Province', 'Area', 'Level']"
            :key="tab"
            :value="tab"
            :class="{ 'active-btn': value === tab }"
            class="rounded-pill"
          >
            <span>{{ tab }}</span>
          </v-btn>
        </v-bottom-navigation>
        <button
          class="px-2 py-2 white--text bg-primary-success-500 rounded-pill mx-2"
          @click="isModalOpen = true"
        >
          + New {{ value }}
        </button>
        <div class="d-flex align-center mx-5">
          <v-text-field
            v-model="searchQuery"
            class="border"
            outlined
            rounded
            dense
            placeholder="Search anything...."
            prepend-inner-icon="mdi-magnify"
          />
          <button
            class="px-4 py-2 del rounded-pill"
            @click="openDeleteConfirmation('selected')"
          >
            🗑 Delete Selected
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <table class="Table">
      <thead class="bg-primary-gray-200">
        <tr>
          <th class="bg-primary-gray-200">
            <input type="checkbox" v-model="selectAll" @change="toggleAll" />
            <span class="px-2 d-inline-block">All</span>
          </th>
          <th class="text-left bg-primary-gray-200 Title">Title</th>
          <th class="text-left bg-primary-gray-200">Date</th>
          <th class="px-4"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in paginatedItems"
          :key="index"
          class="border-b hover:bg-gray-50"
        >
          <td class="px-2">
            <input type="checkbox" v-model="selectedItems" :value="item" />
            {{ item.title }}
          </td>
          <td class="px-2">{{ item.title }}</td>
          <td class="px-2">{{ item.date }}</td>
          <td class="px-2 text-right relative">
            <button @click="toggleMenu(index, $event)" class="p-2">⋮</button>
            <div
              v-if="activeMenu === index"
              class="absolute right-0 bg-white shadow-lg rounded-lg w-32"
            >
              <button
                class="block w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                ✏️ Edit
              </button>
              <button
                class="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                @click="openDeleteConfirmation(index)"
              >
                🗑 Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Footer Actions & Pagination -->
    <div
      class="d-flex align-center justify-space-between mt-4"
      style="width: 90%"
    >
      <div class="flex space-x-2">
        <div class="flex space-x-2">
          <button
            class="px-4 py-2 bg-gray-200 rounded-lg del"
            @click="openDeleteConfirmation('all')"
          >
            Delete All
          </button>
          <button class="px-4 py-2 active-btn rounded-pill">Save</button>
        </div>
      </div>
      <div class="flex space-x-2">
        <button
          class="px-2 py-1 rounded-lg"
          @click="prevPage"
          :disabled="currentPage === 1"
        >
          &lt;
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          class="px-2 py-1 rounded-lg"
          @click="nextPage"
          :disabled="currentPage === totalPages"
        >
          &gt;
        </button>
      </div>
      <select
        class="px-4 py-2 bg-gray-200 rounded-lg del"
        v-model="rowsPerPage"
      >
        <option v-for="option in [10, 20, 50]" :key="option" :value="option">
          {{ option }} Row
        </option>
      </select>
    </div>

    <!-- Modals -->
    <addItemModalVue
      :isOpen.sync="isModalOpen"
      :itemType="value"
      @add="addNewItem"
    />
    <deleteItemModalVue
      :isOpen.sync="isDeleteModalOpen"
      :deleteType="deleteType"
      @confirm="handleDelete"
    />
  </div>
</template>

<script>
import addItemModalVue from "@/components/modals/addItemModal.vue";
import deleteItemModalVue from "@/components/modals/deleteItemModal.vue";
export default {
  components: { addItemModalVue, deleteItemModalVue },
  data() {
    return {
      value: "Province",
      searchQuery: "",
      items: Array.from({ length: 50 }, (_, i) => ({
        title: `Title ${i + 1}`,
        date: "22 January 2022",
      })),
      activeMenu: null,
      selectedItems: [],
      selectAll: false,
      rowsPerPage: 10,
      currentPage: 1,
      isModalOpen: false,
      isDeleteModalOpen: false,
      deleteType: null,
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter((item) =>
        item.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      return this.filteredItems.slice(start, start + this.rowsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.rowsPerPage);
    },
  },
  methods: {
    addNewItem(newItem) {
      this.items.unshift(newItem);
      this.isModalOpen = false;
    },
    toggleMenu(index, event) {
      event.stopPropagation();
      this.activeMenu = this.activeMenu === index ? null : index;
    },
    closeMenu() {
      this.activeMenu = null;
    },
    toggleAll() {
      if (this.selectAll) {
        this.selectedItems = [...this.paginatedItems];
      } else {
        this.selectedItems = [];
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    openDeleteConfirmation(type) {
      this.deleteType = type;
      this.isDeleteModalOpen = true;
    },
    handleDelete() {
      if (this.deleteType === "all") {
        this.items = [];
      } else if (this.deleteType === "selected") {
        this.items = this.items.filter(
          (item) => !this.selectedItems.includes(item)
        );
        this.selectedItems = [];
        this.selectAll = false;
      } else {
        const itemToDelete = this.paginatedItems[this.deleteType];
        this.items = this.items.filter((item) => item !== itemToDelete);
      }
      this.isDeleteModalOpen = false;
      this.deleteType = null;
    },
    async fetchAreas() {
      const response = await this.$axios.$get(
        "/api/v1/admin/locations/countries"
      );
      this.items = response.data.map((state) => ({
        title: state.name,
        date: new Date().toISOString().split("T")[0],
      }));
    },
  },
  watch: {
    value(newValue) {
      if (newValue === "Area") {
        this.fetchAreas();
      }
    },
    rowsPerPage() {
      this.currentPage = 1;
    },
  },
  mounted() {
    document.addEventListener("click", this.closeMenu);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeMenu);
  },
};
</script>

<style scoped>
th,
td {
  text-align: left;
}
td {
  padding: 10px;
  margin: 0;
  border-bottom: 1px solid #e4e7ec;
}
th {
  padding: 10px;
  margin: 0;
}
th:first-child {
  width: 100px;
}
.Title {
  width: 500px;
}
.active-btn {
  background-color: #ffb600 !important; /* پس‌زمینه زرد */
  color: black !important; /* متن سیاه برای خوانایی */
}
.bar {
  box-shadow: none;
  background-color: #f9fafb;
  width: 254px;
  height: 40px !important;
  border-radius: 50px;
}
.border {
  color: #e4e7ec;
  padding: 0 14px;
  width: 360px;
  height: 40px;
  border-radius: 50px;
}
.del {
  width: 147px;
  height: 38px;
  padding: 15px;
  border: 1px solid #e4e7ec;
  color: #101828;
  font-weight: 500;
}
.head {
  width: 80%;
}
.Table {
  width: 90%;
  height: auto;
}
</style>
