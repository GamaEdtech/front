<template>
  <v-dialog v-model="isOpen" max-width="600px">
    <v-card class="boxs">
      <div class="d-flex flex-column align-center justify-center">
        <div class="c">
          <img src="~assets/images/add_circle.png" alt="" />
        </div>
        <v-card-title class="text-h5">Add {{ itemType }}</v-card-title>
      </div>
      <div class="textBox">
        <v-card-text>
          <span>Title</span>
          <v-text-field v-model="newItem.title"  outlined dense />
          <span>code</span>
          <v-text-field v-model="newItem.date" outlined dense />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary w-100 rounded-pill black--text" @click="addItem"
            >save</v-btn
          >
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    isOpen: Boolean,
    itemType: String,
  },
  data() {
    return {
      newItem: {
        title: "",
        date: new Date().toISOString().split("T")[0], // مقدار پیش‌فرض تاریخ امروز
      },
    };
  },
  methods: {
    addItem() {
      if (!this.newItem.title) return;
      this.$emit("add", { ...this.newItem });
      this.closeModal();
    },
    closeModal() {
      this.$emit("update:isOpen", false);
    },
  },
};
</script>
<style scoped>
.boxs {
  max-width: 600px;
  height: 100%;
  padding: 0;
  margin: 0;
  /* background-color: #f2f4f7; */
}

.c {
  background-color: #f2f4f7;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.textBox {
  height: 334px;
  background-color: #f2f4f7;
  width: 100%;
  margin: 0;
  padding: 30px 60px;
}
.textBox span {
  font-size: 16px;
  color: #101828;
  font-weight: 500;
  margin: 10px 0;
}
</style>
