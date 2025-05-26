<template>
  <div>
    <div class="d-flex flex-column justify-space-between align-center mb-1 flex-sm-row">
      <div class="filterBtns mb-4 mb-sm-0">
        <v-btn
          :color="filter === 'all' ? 'primary' : ''"
          depressed
          @click="filter = 'all'"
          rounded
        >
          All
        </v-btn>
        <v-btn
          :color="filter === 'unread' ? 'primary' : ''"
          depressed
          @click="filter = 'unread'"
          rounded
        >
          Unread
        </v-btn>

        <v-btn
          :color="filter === 'read' ? 'primary' : ''"
          depressed
          class="ml-2"
          @click="filter = 'read'"
          rounded
        >
          Read
        </v-btn>
      </div>
    <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        label="Search anything..."
        single-line
        hide-details
        outlined
        class="searchInput"
        rounded
        dense
    ></v-text-field>
    </div>
    <div class="scrollable-table">
        <v-data-table
          :headers="headers"
          :items="filteredList"
          :item-class="isReadClass"
          :items-per-page="selectedPageSize"
          :page.sync="page"
          class="elevation-1"
          :loading="tableLoading"
          v-model="selected"
          hide-default-footer
          show-select
        >

          <template v-slot:header.index="{ header }">
            <span class="gtext-t5">{{ header.text }}</span>
          </template>

          <template v-slot:item.index="{ index }">
          {{ index + 1 }} 
          </template>

          <template v-slot:header.fullName="{ header }">
            <span class="gtext-t5">{{ header.text }}</span>
          </template>

          <template v-slot:item.fullName="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="40" class="mr-2" v-show="item.avatar">
                <img alt="Avatar" />
              </v-avatar>
              <span>{{ item.fullName }}</span>
            </div>
          </template>

          <template v-slot:header.subject="{ header }">
            <span class="gtext-t5">{{ header.text }}</span>
          </template>

          <template v-slot:header.attachedFile="{ header }">
            <span class="gtext-t5 mdi mdi-paperclip">{{ header.text }}</span>
          </template>

          <template v-slot:header.date="{ header }">
            <span class="gtext-t5">{{ header.text }}</span>
          </template>

          <template v-slot:header.actions="{ header }">
            <span class="gtext-t5">{{ header.text }}</span>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex">
              <v-icon
              small
              class="mr-2 gtext-t1"
              @click="viewMessageDetails(item.id)"
            >
              mdi-file-find
            </v-icon>
            <v-icon
              small
              class="gtext-t1"
              @click="handleDelete(item.id)"
            >
              mdi-delete
            </v-icon>
            </div>
          </template>
      </v-data-table>
       
      <ViewMessageDetailsModal
        :dialog.sync="dialogVisible"
        :message="selectedMessage"
        :email="selectedEmail"
        :name="selectedName"
        @next="goToNextMessage(selectedId)"
        :disableNext="disableNextBtn"
        @back="goToPreviousMessage(selectedId)"
        :disableBack="disableBackBtn"
      />
      <DeleteMessage
        :isOpen.sync="isDeleteModalOpen"
        @confirm="deleteMessage()"
      />
    </div>
    <v-row
      class="mt-2"
      align="center"
      justify="space-between"
      no-gutters
    >
      
      <v-col
        cols="12"
        class="d-flex flex-wrap flex-sm-nowrap align-center justify-space-between"
      >
        
        <div class="d-flex align-center mb-2 mb-sm-0">
          <v-select
            v-model="selectedAction"
            :items="allActions"
            item-text="label"
            item-value="value"
            solo
            dense
            class="rounded-pill footerBtns"
            :disabled="!selected.length"
          ></v-select>

          <v-btn
            class="rounded-pill bg-primary-gray-700 white--text ml-4"
            :disabled="!selected.length"
          >
            <span>Do</span>
          </v-btn>
        </div>
        <!-- Pagination (hidden on mobile here) -->
        <div class="d-none d-sm-flex">
          <v-pagination
          next-icon="mdi-arrow-right"
          prev-icon="mdi-arrow-left"
            v-model="page"
            :length="pageCount"
            :total-visible="5"
            class="custom-pagination"
          ></v-pagination>
        </div>

        
        <div class="mb-2 mb-sm-0">
          <v-select
            v-model="selectedPageSize"
            :items="allPageSize"
            item-text="label"
            item-value="value"
            solo
            dense
            class="rounded-pill footerBtns"
          ></v-select>
        </div>
      </v-col>

      <!-- Pagination (visible only on xs, second row) -->
      <v-col
        cols="12"
        class="d-flex justify-center d-sm-none mt-2"
      >
        <v-pagination
        next-icon="mdi-arrow-right"
          prev-icon="mdi-arrow-left"
          v-model="page"
          :length="pageCount"
          :total-visible="5"
          class="custom-pagination"
        ></v-pagination>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ViewMessageDetailsModal from "@/components/modals/viewMessageDetailsModal.vue"
import DeleteMessage from "@/components/modals/deleteItemModal.vue"
export default {
  layout: "admin",
  auth:false,
  components: {ViewMessageDetailsModal,DeleteMessage},
  data() {
    return {
      list:[],
      headers: [
          {
            text: '#',
            align: 'start',
            sortable: false,
            value: 'index',
            width: '5vw', 
          },
          { text: 'Name',
            value: 'fullName',
            sortable: false,
            width: '15vw', 
         },
          { text: 'Subject',
            value: 'subject',
            sortable: false,
            width: '15vw', 
         },
         {  text: 'Attachment file',
            value: 'attachedFile',
            sortable: false,
            width: '17vw', 
         },
         {  text: 'Date',
            value: 'date',
            width: '10vw', 
         },
          { text: 'Actions',
            value: 'actions',
            sortable: false,
            width: '5vw', 
          },
        ],
        tableLoading: true,
        dialogVisible: false,
        isDeleteModalOpen: false,
        selectedMessage: '',
        selectedEmail: '',
        selectedName: '',
        selectedId: null,
        selectedDeleteId: null,
        search: '',
        filter: 'all',
        filteredList: [],
        allActions: [
        { label: 'Delete All', value: 'deleteAll' },
        { label: 'Read All', value: 'readAll' },
      ],
      selectedAction: null,
      allPageSize: [
        { label: '10 Rows', value: 10 },
        { label: '20 Rows', value: 20 },
        { label: '50 Rowa', value: 50 },
      ],
      selectedPageSize: null,
      page: 1,
      pageCount: 0,
      totalCount: 0,
      selected: [],
      disableNextBtn: false,
      disableBackBtn: false
      };
  },
  methods:{
    async fetchContactUs(selectedPageSize,page){
      this.tableLoading = true
      try{
        let response =  await this.$axios.$get('/api/v2/admin/contacts',
          {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("v2_token")}`,
              },
            params:{
              'PagingDto.PageFilter.Size': selectedPageSize,
              'PagingDto.PageFilter.Skip':(page-1) * selectedPageSize,
              'PagingDto.PageFilter.ReturnTotalRecordsCount': true,
            }
          }
        )
        this.list = response.data.list
        this.filteredList = this.list
        this.totalCount = response.data.totalRecordsCount
        this.tableLoading = false
        this.pageCount = Math.ceil(this.totalCount / this.selectedPageSize)
      }
      catch(err){
        if (err.response.status == 400)
              this.$toast.error(err.response.data.message);
      }
    },
    async viewMessageDetails(id){
      try{
        const response = await this.$axios.$get(`/api/v2/admin/contacts/${id}`,{
        headers: {
                Authorization: `Bearer ${localStorage.getItem("v2_token")}`,
              },
      })
        this.selectedMessage = response.data.body
        this.selectedEmail = response.data.email
        this.selectedName = response.data.fullName
        this.selectedId = response.data.id
        this.dialogVisible = true

        const index = this.list.findIndex(item => item.id === id);
        setTimeout(() => {
          if (index !== -1) {
            this.$set(this.list, index, {
              ...this.list[index],
              isRead: true
            });
          }          
        },1500)
        this.disableNextBtn = index >= this.list.length - 1;
        this.disableBackBtn = index <= 0;
        
        
      }
      catch(err){
        if (err.response.status == 400)
          this.$toast.error(err.response.data.message);
      }
    },
    goToNextMessage(id){
      const index = this.list.findIndex(item => item.id === id);
      if(this.list.length - 1 > index)
        this.viewMessageDetails(this.list[index+1].id)
    },
    goToPreviousMessage(id){
      const index = this.list.findIndex(item => item.id === id);
      if(index != 0 )
        this.viewMessageDetails(this.list[index-1].id)
    },

    async deleteMessage(){
      try{
        await this.$axios.$delete(`/api/v2/admin/contacts/${this.selectedDeleteId}`,{
          headers: {
                Authorization: `Bearer ${localStorage.getItem("v2_token")}`,
              },
        })
        if(this.list.length > 1){
          this.list = this.list.filter(i => i.id !== this.selectedDeleteId);
          this.filteredList = this.list
          this.$toast.success("Message deleted successfully!");
          }
        else{
          this.list.pop()
          this.filteredList.pop()
          this.$toast.success("Message deleted successfully!");
          }
      }
      catch(err){
        if(err.response.status == 400)
          this.$toast.error(err.response.data.message)
      }
      finally{
        this.isDeleteModalOpen = false
        this.fetchContactUs(this.selectedPageSize,this.page)
      }
    },
    handleDelete(id){
      this.isDeleteModalOpen = true
      this.selectedDeleteId = id
    },
    isReadClass(item) {
      return item.isRead === false ? 'font-weight-heavy' : '';
    },
  },
  mounted(){
    this.selectedAction = this.allActions[0];
    this.selectedPageSize = this.allPageSize[0].value;
  },
  watch: {
  page() {
    this.filter = 'all'
    this.fetchContactUs(this.selectedPageSize,this.page);
  },
  selectedPageSize() {
    this.page = 1; // reset to first page
    this.fetchContactUs(this.selectedPageSize, this.page);
  },
  filter: {
    immediate: true,
    handler(val) {
      this.filteredList = this.list.filter(item =>
        val === 'read' ? item.isRead : !item.isRead
      );
      if(val == 'all')
        this.filteredList = this.list
    }
  }
}
};
</script>
<style scoped>
.scrollable-table {
  max-height: 75vh;  
  overflow-y: auto;
  overflow-x: hidden;
}

.searchInput{
  width: 360px !important;
  max-width: 360px;
  height: 40px;
}
.searchInput >>> .v-input__control , .searchInput >>> .v-input__slot{
  height: 40px !important;
  min-height: 40px !important;
}

.filterBtns , .filterBtns > .v-btn{
  background-color: #F9FAFB;
  border-radius: 28px;
  height: 40px;
}
.searchInput >>> .v-input__prepend-inner {
  margin-top: 9px !important;
}

.searchInput >>> .v-label{
  top: 11px;
}
.footerBtns{
  width: 150px !important;
  max-width: 150px !important;
  height: 42px !important;
  max-height: 42px !important;
}

.v-pagination > li > button {
  margin: 0.1rem !important;
}

.custom-pagination {
  width: 100% !important;
  justify-content: center !important;
}

.custom-pagination >>> li button.primary {
  background: #ffb300 !important;
}

.v-data-table >>> td {
  cursor: default !important;
}

</style>