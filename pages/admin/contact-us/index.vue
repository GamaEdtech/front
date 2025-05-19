<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-9">
      <div class="filterBtns">
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
          loading-text="Loading... Please wait"
          :search="search"
          @page-count="pageCount = $event"
          hide-default-footer
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
      />
      <DeleteMessage
        :isOpen.sync="isDeleteModalOpen"
        @confirm="deleteMessage()"
      />
    </div>
    <div class="d-flex align-center justify-space-between mt-5">
      <div class="d-flex align-center">
        <v-select
             v-model="selectedAction"
             :items="allActions"
             item-text="label"
             item-value="value"
             solo
             dense
             class="rounded-pill footerBtns"
           ></v-select>
          <v-btn
          class="rounded-pill bg-primary-gray-700 white--text ml-4">
            <span>Do</span>
          </v-btn>
      </div>
        <div class="text-center">
          <v-pagination
            v-model="page"
            :length="pageCount"
            :total-visible="5"
          ></v-pagination>
        </div>
        <v-select
           v-model="selectedPageSize"
           :items="allPageSize"
           item-text="label"
           item-value="value"
           solo
           dense
           class="rounded-pill footerBtns"
           @change="fetchContactUs"
         ></v-select>
    </div>
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
          { text: 'FullName',
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
        { label: '5 Rows', value: 5 },
        { label: '10 Rows', value: 10 },
        { label: '15 Rowa', value: 15 },
      ],
      selectedPageSize: null,
      page: 1,
      pageCount: 4
      };
  },
  methods:{
    async fetchContactUs(selectedPageSize){
      try{
        let response =  await this.$axios.$get('/api/v2/admin/contacts',
          {headers: {
              Authorization: `${this.$auth.strategy.token.get()}`,
            },
            params:{
              'PagingDto.PageFilter.Size': selectedPageSize,
            }
          }
        )
        this.list = response.data.list
        this.filteredList = this.list
        this.tableLoading = false
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
              Authorization: `${this.$auth.strategy.token.get()}`,
            },
      })
        this.selectedMessage = response.data.body
        this.selectedEmail = response.data.email
        this.selectedName = response.data.fullName
        this.dialogVisible = true
        setTimeout(() => {
          const index = this.list.findIndex(item => item.id === id);
          if (index !== -1) {
            this.$set(this.list, index, {
              ...this.list[index],
              isRead: true
            });
          }
        },1500)
        
      }
      catch(err){
        if (err.response.status == 400)
          this.$toast.error(err.response.data.message);
      }
    },
    async deleteMessage(){
      try{
        await this.$axios.$delete(`/api/v2/admin/contacts/${this.selectedDeleteId}`,{
          headers: {
              Authorization: `${this.$auth.strategy.token.get()}`,
            },
        })
        if(this.list.length > 1){
          this.list = this.list.filter(i => i.id !== this.selectedDeleteId);
          this.filteredList = this.list
          }
        else{
          this.list.pop()
          this.filteredList.pop()
          }
      }
      catch(err){
        if(err.response.status == 400)
          this.$toast.error(err.response.data.message)
      }
      finally{
        this.isDeleteModalOpen = false
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
    this.fetchContactUs(this.selectedPageSize)
  },
  watch: {
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

</style>