<template>
  <v-card class="order-btn-holder d-block d-md-none">
    <v-card-text class="pb-0">
      <v-row class="px-10 text-center">
        <v-col cols="12" class="pb-1 pt-0">
          <div v-if="contentData?.files?.word.exist">
            <v-btn
              @click="$emit('download', 'q_word')"
              block
              color="primary"
              class="mb-2"
            >
              Download Question Doc
              {{
                contentData?.files?.word.price > 0
                  ? "| $" + contentData?.files?.word.price
                  : ""
              }}
            </v-btn>
          </div>
          <div v-if="contentData?.files.pdf.exist">
            <v-btn
              @click="$emit('download', 'q_pdf')"
              class="mb-2 white--text font-weight-bold"
              block
              color="#E60012"
            >
              Question Paper
              {{
                contentData?.files?.pdf.price > 0
                  ? "| $" + contentData?.files?.pdf.price
                  : ""
              }}
            </v-btn>
          </div>
          <div v-if="contentData?.files.answer.exist">
            <v-btn
              v-show="contentData?.files.answer.ext == 'pdf'"
              class="mb-2 font-weight-bold"
              @click="$emit('download', 'a_file')"
              block
              color="teal accent-3"
            >
              Mark Scheme
              {{
                contentData?.files?.answer.price > 0
                  ? "| $" + contentData?.files?.answer.price
                  : ""
              }}
            </v-btn>
            <v-btn
              v-show="contentData?.files.answer.ext == 'word'"
              @click="$emit('download', 'a_file')"
              block
              color="primary"
              class="mb-2"
            >
              Download Answer Doc
              {{
                contentData?.files?.answer.price > 0
                  ? "| $" + contentData?.files?.answer.price
                  : ""
              }}
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12">
          <div class="mb-4" v-if="!isFree">
            <p v-if="!isLoggedIn">
              <span class="mdi mdi-bell icon"></span>
              <span
                @click="$emit('open-auth', 'login')"
                class="login blue--text"
                >Login</span
              >
              <span
                @click="$emit('open-auth', 'register')"
                class="register blue--text"
              >
                (register)
              </span>
              <span>to download and charge.</span>
            </p>
            <span v-else>
              Your wallet charge is ${{ userCredit }}
              <nuxt-link
                class="blue--text"
                v-if="isLoggedIn"
                to="/user/charge-wallet"
                >(Top Up Wallet)</nuxt-link
              >
            </span>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  contentData: {
    type: Object,
    required: true,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  userCredit: {
    type: [Number, String],
    default: 0,
  },
  isFree: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["download", "open-auth"]);
</script>

<style scoped>
.order-btn-holder {
  position: fixed !important;
  bottom: 0 !important;
  z-index: 2 !important;
  padding-top: 16px !important;
  background: #f6f8fa !important;
  border-top: 0.1rem solid #e1e2e3;
  width: 100%;
}

.order-btn-holder .v-btn {
  width: 40% !important;
}

.order-btn-holder span {
  font-size: 1.3rem;
}

p {
  font-size: 1.3rem !important;
}
</style>
