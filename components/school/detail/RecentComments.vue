<template>
  <v-row v-show="commentList.length">
    <v-col cols="12">
      <h3 class="gtext-h5 primary-gray-600">Comments</h3>
    </v-col>
    <v-col cols="12" md="12">
      <v-card
        v-for="comment in commentList"
        :key="comment.id"
        class="comment-card primary-gray-100 pt-4 mb-3"
        elevation="1"
      >
        <v-card-text>
          <div class="comment-card-header">
            <div class="d-flex float-left">
              <v-avatar size="60">
                <img class="profile-avatar" :src="comment.creationUserAvatar" />
              </v-avatar>
              <div class="ml-2">
                <div class="gtext-t2 primary-gray-900">
                  {{ comment.creationUser }}
                </div>
              </div>
            </div>
            <div class="float-right">
              <v-rating
                v-model="comment.averageRate"
                background-color="orange lighten-3"
                color="orange"
                half-increments
                hover
                size="24"
                readonly
              ></v-rating>
            </div>
          </div>
          <v-divider class="mb-5" />
          <div class="gtext-t2 primary-gray-700 mb-6">
            "{{ comment.comment }}"
          </div>
          <div class="pb-8">
            <div class="float-left">
              <v-btn
                class="bg-primary-gray-700 white--text mr-6"
                variant="fab"
                size="x-small"
                icon
              >
                <v-icon size="14" color="white"> mdi-thumb-down </v-icon>
              </v-btn>
              <v-btn
                class="bg-primary-gray-700 white--text mr-6"
                variant="fab"
                size="x-small"
                icon
              >
                <v-icon size="14" color="white"> mdi-thumb-up </v-icon>
              </v-btn>
              <v-btn
                class="bg-primary-blue-500 white--text"
                variant="fab"
                size="x-small"
                icon
              >
                <v-icon size="14" color="white"> mdi-forum </v-icon>
              </v-btn>
            </div>
            <div class="float-right gtext-t5">
              {{ comment.creationDate }}
            </div>
          </div>
        </v-card-text>
      </v-card>
      <div class="text-center mt-14">
        <v-btn
          rounded
          class="text-transform-none gtext-t4 font-weight-medium"
          color="white"
          size="x-large"
          >Load more</v-btn
        >
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps({
  commentList: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.comment-card-header {
  height: 8rem;
}
</style>
