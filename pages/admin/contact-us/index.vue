<template>
    <div class="scrollable-table">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-data-table
        :headers="headers"
        :items="list"
        :item-class="isReadClass"
        :items-per-page="10"
        class="elevation-1"
        :loading="tableLoading"
        loading-text="Loading... Please wait"
        :search="search"
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
    />
    <DeleteMessage
      :isOpen.sync="isDeleteModalOpen"
      @confirm="deleteMessage()"
    />
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
            width: '25vw', 
         },
          { text: 'Subject',
            value: 'subject',
            sortable: false,
            width: '25vw', 
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
        selectedDeleteId: null,
        search: '',
    };
  },
  methods:{
    async fetchContactUs(){
      try{
        let response =  await this.$axios.$get('/api/v2/admin/contacts',
          {headers: {
              Authorization: `${this.$auth.strategy.token.get()}`,
            },
            params:{
              'PagingDto.PageFilter.Size': 25,
            }
          }
        )
        this.list = response.data.list
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
        if(this.list.length > 1)
          this.list = this.list.filter(i => i.id !== this.selectedDeleteId);
        else
          this.list.pop()
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
    this.fetchContactUs()
  }
};
</script>
<style scoped>
.scrollable-table {
  max-height: 90vh;  
  overflow-y: auto;
}

</style>