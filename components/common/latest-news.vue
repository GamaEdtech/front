<template>
  <div>
    <div class="feed-header d-none d-md-flex font-weight-bold">
      <img
        :src="require('@/assets/images/' + thirdFeedBoxIcon)"
        alt=""
        class="mx-2"
        width="28"
      />
      Latest News
    </div>

    <div class="d-flex flex-column pa-3">
      <div class="feed-box-item d-flex" v-for="item in news">
        <div class="feedBoxImg">
          <v-img
            max-width="100"
            max-height="100"
            contain
            min-height="70"
            :src="item.pic"
            :alt="item.title"
          />
        </div>
        <div class="feed-content pa-3 d-flex flex-column justify-space-between">
          <p>
            {{ item.title }}
          </p>
          <div class="d-flex justify-space-between">
            <div class="feed-title">
              <i class="fa-solid fa-grip-vertical ml-2"></i>
              {{ item.cat_title }}
            </div>
            <div class="feed-date">
              <i class="fa-solid fa-calendar-days ml-2"></i>
              {{ $dayjs(item.subdate).format("MMM DD") }}
            </div>
          </div>
        </div>
      </div>
      <v-divider></v-divider>
    </div>
    <div class="feed-footer d-flex align-center pa-3">
      <nuxt-link to="/" class="pb-0 feed-more mr-4">More </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "latest-news",
  data() {
    return {
      thirdFeedBoxIcon: "News.png",
      news: [],
    };
  },
  mounted() {
    this.getNews();
  },
  methods: {
    async getNews() {
      await useApiService
        .get("/api/v1/home/news")
        .then((res) => {
          this.news = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped></style>
