<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    style="height: 404px !important"
    @input="onDialogInput"
  >
    <v-card class="boxs">
      <div class="d-flex flex-column align-center justify-center pt-6">
        <div class="icon-container">
          <!-- <img src="~assets/images/Vector (1).svg" alt="Icon" /> -->
          <v-icon color="red" large>mdi-delete</v-icon>
        </div>
        <v-card-title class="font-size-18 primary-gray-700 font-bold"
          >Are you Sure?</v-card-title
        >
      </div>

      <div class="text-box">
        <v-card-text class="d-flex align-center justify-center">
          <span>Do you want to delete this item?</span>
        </v-card-text>

        <v-card-actions class="action-buttons">
          <v-btn
            depressed
            color="bg-Error"
            class="w-50 rounded-pill white--text"
            @click="handleDelete"
          >
            Delete
          </v-btn>

          <v-btn
            depressed
            color="bg-white"
            class="w-50 rounded-pill black--text"
            @click="closeModal"
          >
            Not Yet
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    itemType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      newItem: {
        title: "",
        date: new Date().toISOString().split("T")[0], // Default to today's date
      },
    };
  },
  methods: {
    handleDelete() {
      // if (!this.newItem.title) return;
      this.$emit("confirm", { ...this.newItem });
      this.closeModal();
    },
    closeModal() {
      this.$emit("update:isOpen", false);
    },
    onDialogInput(val) {
      if (!val) {
        this.$emit("close");
      }
    },
  },
};
</script>

<style scoped>
.boxs {
  max-width: 600px;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.icon-container {
  background-color: #f2f4f7;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-box {
  background-color: #f2f4f7;
  width: 100%;
  margin: 0;
  padding: 30px 60px;
}

.text-box span {
  font-size: 16px;
  color: #101828;
  font-weight: 500;
  margin: 10px 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
}
</style>
