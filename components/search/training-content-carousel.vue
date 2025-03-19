<!-- in refactor proccess -->

<template>
  <div class="book-carousel my-3">
    <v-container class="mx-0">
      <v-row>
        <v-col lg="2" cols="4" class="pa-0">
          <div class="book-carousel-sub d-flex flex-column align-center">
            <div
              class="book-carousel-title d-flex flex-column align-center my-3"
            >
              <h4>Course</h4>
              <p>{{ bookCarousel.carouselName }}</p>
            </div>
            <div class="carousel-img my-3 d-flex justify-center">
              <v-img
                lazy-src="https://picsum.photos/id/11/10/6"
                max-height="115"
                max-width="90%"
                :src="require('@/assets/images/' + bookCarousel.carouselImg)"
                class="books-image"
              ></v-img>
            </div>
            <div class="book-carousel-q my-3">
              <p>complete courses</p>
            </div>
          </div>
        </v-col>
        <v-col lg="10" cols="8" class="pa-0">
          <v-sheet
            class="mx-auto book-carousel-books"
            elevation="8"
            max-width="900"
          >
            <v-slide-group
              v-model="model_slide"
              class="pa-4"
              center-active
              show-arrows
            >
              <v-slide-item
                v-for="book in books"
                :key="book.value"
                class="mx-2 slide-item mt-6"
              >
                <div>
                  <div class="book-body pa-5">
                    <img
                      :src="require('@/assets/images/' + book.img)"
                      alt=""
                      class="book-body-image"
                    />
                    <nuxt-link to="">
                      <h3 class="book-title text-center">{{ book.title }}</h3>
                    </nuxt-link>
                    <nuxt-link to="">
                      <div
                        class="book-season px-2 py-1 my-2 d-flex justify-space-between align-center"
                      >
                        <p class="season-number">{{ book.season }}</p>
                        <p>Season</p>
                      </div>
                    </nuxt-link>
                    <nuxt-link to="">
                      <div
                        class="book-price px-2 py-1 my-2 d-flex justify-space-between align-center"
                      >
                        <p class="price-number">{{ book.price }}</p>
                        <p>Dollar</p>
                      </div>
                    </nuxt-link>
                  </div>
                </div>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "training-content-carousel",
  data() {
    return {
      model_slide: 0,
      bookCarousel: {
        carouselName: "List",
        carouselImg: "carouselBook.png",
      },
      books: [
        {
          img: "poster1.jpg",
          title: "Maths",
          season: "14",
          price: "3405",
        },
        {
          img: "book2.png",
          title: "History",
          season: "14",
          price: "3405",
        },
        {
          img: "book3.png",
          title: "Art",
          season: "14",
          price: "3405",
        },
        {
          img: "book4.png",
          title: "Geography",
          season: "14",
          price: "3405",
        },
        {
          img: "poster1.jpg",
          title: "Maths",
          season: "14",
          price: "3405",
        },
        {
          img: "book2.png",
          title: "Maths",
          season: "14",
          price: "3405",
        },
        {
          img: "poster1.jpg",
          title: "Maths",
          season: "14",
          price: "3405",
        },
        {
          img: "book2.png",
          title: "History",
          season: "14",
          price: "3405",
        },
        {
          img: "book3.png",
          title: "Art",
          season: "14",
          price: "3405",
        },
        {
          img: "book4.png",
          title: "Geography",
          season: "14",
          price: "3405",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
