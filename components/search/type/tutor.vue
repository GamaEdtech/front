<!-- in refactor proccess -->

<template>
  <div>
    <!-- mobile header -->
    <div
      class="d-flex align-center justify-space-between logo-search-content mx-5 d-flex d-sm-none"
    >
      <div class="pl-2 header-search mobile-res-search my-4">
        <v-btn class="px-0 btn-transparent search-btn-icon">
          <v-icon class="search-icon">mdi-magnify</v-icon>
        </v-btn>
        <v-divider vertical></v-divider>
        <v-text-field
          class="py-1 my-0 search-field main-search-icon mr-2 mt-4"
          placeholder="Search ..."
        >
        </v-text-field>
      </div>
    </div>
    <!-- Start : sample-q -->
    <section class="teachers">
      <v-container>
        <div class="teachers-contents">
          <div class="teachers-content">
            <div class="teacher-items mb-6">
              <v-row>
                <v-col
                  lg="4"
                  v-for="(item, img) in card"
                  :key="img"
                  class="card"
                >
                  <div class="card-user pa-4">
                    <div class="card-user-header align-center d-none d-md-flex">
                      <div class="card-user-profile">
                        <img
                          :src="require('@/assets/images/' + item.userImg)"
                          alt=""
                          class="card-user-image"
                        />
                      </div>
                      <div class="card-user-name ml-3">
                        <p class="mb-0">{{ item.userName }}</p>
                      </div>
                    </div>
                    <div
                      class="card-user-header-mobile d-flex d-md-none align-center justify-space-between"
                    >
                      <div class="d-flex align-center">
                        <div
                          :class="
                            'card-user-profile card-user-profile' + (img + 1)
                          "
                        >
                          <img
                            :src="require('@/assets/images/' + item.userImg)"
                            alt=""
                            :class="
                              'card-user-image card-user-image' + (img + 1)
                            "
                          />
                        </div>
                        <div class="card-user-name ml-3">
                          <p class="mb-0">{{ item.userName }}</p>
                        </div>
                      </div>
                      <div
                        :class="
                          ' d-flex card-user-active card-user-active' +
                          (img + 1)
                        "
                      >
                        <p class="mr-5">{{ item.active }}</p>
                      </div>
                    </div>
                    <p class="mb-0 card-user-profile-sub d-none d-md-block">
                      {{ item.sub }}
                    </p>
                    <div class="card-user-content mt-4">
                      <p class="card-user-major mb-2">
                        <i class="fa-solid fa-graduation-cap"></i>
                        {{ item.major }}
                      </p>
                      <p class="card-user-address mb-2">
                        <i class="fa-solid fa-location-dot"></i>
                        {{ item.address }}
                      </p>
                      <div class="card-user-tags d-flex my-4">
                        <nuxt-link to="" v-for="tag in tags" :key="tag.value">
                          <div class="card-user-tag px-3 py-1">
                            {{ tag.name }}
                          </div>
                        </nuxt-link>
                      </div>
                      <div class="card-user-details my-4">
                        <v-btn @click="snackbar = true" class="button">
                          <nuxt-link
                            to=""
                            class="card-user-detail d-flex align-center"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.43 7.99832L10 0L7.57 7.99832H0L6.18 12.4074L3.83 19.9958L10 15.3068L16.18 19.9958L13.83 12.4074L20 7.99832H12.43Z"
                                fill="#F9A825"
                              />
                            </svg>
                            <p class="mb-0 mx-2">{{ item.star }}</p>
                          </nuxt-link>
                        </v-btn>
                        <v-overlay :value="overlay"></v-overlay>
                        <v-btn @click="snackbar = true" class="button">
                          <nuxt-link
                            to=""
                            class="card-user-detail d-flex align-center"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16 2.00004H14V0H4V2.00004H2C0.9 2.00004 0 2.90005 0 4.00007V5.00009C0 7.55013 1.92 9.63017 4.39 9.94017C5.02 11.4402 6.37 12.5702 8 12.9002V16.0003H4V18.0003H14V16.0003H10V12.9002C11.63 12.5702 12.98 11.4402 13.61 9.94017C16.08 9.63017 18 7.55013 18 5.00009V4.00007C18 2.90005 17.1 2.00004 16 2.00004ZM2 5.00009V4.00007H4V7.82014C2.84 7.40013 2 6.30011 2 5.00009ZM16 5.00009C16 6.30011 15.16 7.40013 14 7.82014V4.00007H16V5.00009Z"
                                fill="#F9A825"
                              />
                            </svg>
                            <p class="mb-0 mx-2">{{ item.star }}</p>
                          </nuxt-link>
                        </v-btn>
                        <v-btn @click="snackbar = true" class="button">
                          <nuxt-link
                            to=""
                            class="card-user-detail d-flex align-center"
                          >
                            <svg
                              width="20"
                              height="12"
                              viewBox="0 0 20 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M14 -0.000976562L16.29 2.28854L11.41 7.16752L7.41 3.16836L0 10.5868L1.41 11.9965L7.41 5.99776L11.41 9.99692L17.71 3.70824L20 5.99776V-0.000976562H14Z"
                                fill="#F9A825"
                              />
                            </svg>

                            <p class="mb-0 mx-2">{{ item.star }}</p>
                          </nuxt-link>
                        </v-btn>
                        <v-snackbar
                          v-model="snackbar"
                          :vertical="vertical"
                          timeout="0"
                        >
                          <div class="pa-3">
                            {{ title }}
                            <div class="star mt-8 mb-4">
                              <nuxt-link
                                to=""
                                class="card-user-detail d-flex align-center"
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12.43 7.99832L10 0L7.57 7.99832H0L6.18 12.4074L3.83 19.9958L10 15.3068L16.18 19.9958L13.83 12.4074L20 7.99832H12.43Z"
                                    fill="#F9A825"
                                  />
                                </svg>
                                <p class="mb-0 mx-2">rate :{{ star }}</p>
                              </nuxt-link>
                            </div>
                            <div class="cup my-4">
                              <nuxt-link
                                to=""
                                class="card-user-detail d-flex align-center"
                              >
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M16 2.00004H14V0H4V2.00004H2C0.9 2.00004 0 2.90005 0 4.00007V5.00009C0 7.55013 1.92 9.63017 4.39 9.94017C5.02 11.4402 6.37 12.5702 8 12.9002V16.0003H4V18.0003H14V16.0003H10V12.9002C11.63 12.5702 12.98 11.4402 13.61 9.94017C16.08 9.63017 18 7.55013 18 5.00009V4.00007C18 2.90005 17.1 2.00004 16 2.00004ZM2 5.00009V4.00007H4V7.82014C2.84 7.40013 2 6.30011 2 5.00009ZM16 5.00009C16 6.30011 15.16 7.40013 14 7.82014V4.00007H16V5.00009Z"
                                    fill="#F9A825"
                                  />
                                </svg>
                                <p class="mb-0 mx-2">
                                  rate in country :{{ cup }}
                                </p>
                              </nuxt-link>
                            </div>
                            <div class="increase mt-4">
                              <nuxt-link
                                to=""
                                class="card-user-detail d-flex align-center"
                              >
                                <svg
                                  width="20"
                                  height="12"
                                  viewBox="0 0 20 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14 -0.000976562L16.29 2.28854L11.41 7.16752L7.41 3.16836L0 10.5868L1.41 11.9965L7.41 5.99776L11.41 9.99692L17.71 3.70824L20 5.99776V-0.000976562H14Z"
                                    fill="#F9A825"
                                  />
                                </svg>
                                <p class="mb-0 mx-2">
                                  rate in state :{{ increase }}
                                </p>
                              </nuxt-link>
                            </div>
                          </div>
                          <v-btn
                            color="teal"
                            text
                            @click="snackbar = false"
                            class="back-btn"
                          >
                            Understand
                          </v-btn>
                          <!-- <template v-slot:action="{ attrs }">

                          </template> -->
                        </v-snackbar>
                      </div>
                      <div class="card-user-btns d-flex">
                        <v-row>
                          <v-col lg="6" cols="5" class="pa-1">
                            <v-btn
                              color="primary"
                              medium
                              outlined
                              class="card-user-btn-chat"
                            >
                              Chat
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                class="ml-4"
                              >
                                <path
                                  d="M18 0H2C0.9 0 0.00999999 0.9 0.00999999 2L0 20L4 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM4 7H16V9H4V7ZM12 12H4V10H12V12ZM16 6H4V4H16V6Z"
                                  fill="#25D366"
                                />
                              </svg>
                            </v-btn>
                          </v-col>
                          <v-col lg="6" cols="5" class="pa-1">
                            <v-btn
                              color="primary"
                              medium
                              outlined
                              class="card-user-btn-class"
                            >
                              class
                              <svg
                                width="15"
                                height="18"
                                viewBox="0 0 15 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                class="ml-3"
                              >
                                <path
                                  d="M14.98 11.82L14.35 16.28C14.21 17.27 13.36 18 12.37 18H6.21C5.68 18 4.92 17.79 4.55 17.41L0 12.62L0.83 11.78C1.07 11.54 1.41 11.43 1.75 11.5L5 12.24V1.5C5 0.67 5.67 0 6.5 0C7.33 0 8 0.67 8 1.5V7.5H8.91C9.22 7.5 9.53 7.57 9.8 7.71L13.89 9.75C14.66 10.14 15.1 10.97 14.98 11.82Z"
                                  fill="#F1C40f"
                                />
                              </svg>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
            <Pagination />
          </div>
        </div>
      </v-container>
    </section>
  </div>
</template>
<script>
import category from "~/components/common/category.vue";
import Pagination from "~/components/common/pagination.vue";
import FilterModal from "~/components/common/filter-modal.vue";
import Tabs from "~/components/common/tabs.vue";

export default {
  name: "tutor-list",
  components: { category, Pagination, FilterModal, Tabs },
  data() {
    return {
      item: ["Foo", "Bar", "Fizz", "Buzz"],
      overlay: false,
      snackbar: false,
      title: "Tutors rating :",
      vertical: true,
      star: "8543",
      cup: "22",
      increase: "6",
      sampleFilters: [
        {
          filterTitle: "grade",
          filterContent:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
        },
        {
          filterTitle: "Book",
          filterContent:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
        },
        {
          filterTitle: "Title",
          filterContent:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
        },
        {
          filterTitle: "grade",
          filterContent:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
        },
        {
          filterTitle: "Book",
          filterContent:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
        },
        {
          filterTitle: "Title",
          filterContent:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
        },
        {
          filterTitle: "grade",
          filterContent:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
        },
      ],
      switchs: [
        {
          switchTitle: "Word",
        },
      ],
      card: [
        {
          userImg: "user.jpg",
          userName: "Alireza Davoodi",
          active: "online",
          sub: "offline",
          major: "Master's student in biology Master's student... ",
          address: "Master's student in biology Master's student...",
          star: "8543",
          cup: "22",
          increase: "6",
        },
        {
          userImg: "user.jpg",
          userName: "Alireza Davoodi",
          active: "offline",
          sub: "offline",
          major: "Master's student in biology Master's student... ",
          address: "Master's student in biology Master's student... ",
          star: "8543",
          cup: "22",
          increase: "6",
        },
        {
          userImg: "user.jpg",
          userName: "Alireza Davoodi",
          active: "Long time ago",
          sub: "offline",
          major: "Master's student in biology Master's student... ",
          address: "Master's student in biology Master's student... ",
          star: "8543",
          cup: "22",
          increase: "6",
        },
        {
          userImg: "user.jpg",
          userName: "Alireza Davoodi",
          active: "online",
          sub: "offline",
          major: "Master's student in biology Master's student... ",
          address: "Master's student in biology Master's student... ",
          star: "8543",
          cup: "22",
          increase: "6",
        },
        {
          userImg: "user.jpg",
          userName: "Alireza Davoodi",
          active: "offline",
          sub: "offline",
          major: "Master's student in biology Master's student... ",
          address: "Master's student in biology Master's student... ",
          star: "8543",
          cup: "22",
          increase: "6",
        },
        {
          userImg: "user.jpg",
          userName: "Alireza Davoodi",
          active: "long time ago",
          sub: "offline",
          major: "Master's student in biology Master's student... ",
          address: "Master's student in biology Master's student... ",
          star: "8543",
          cup: "22",
          increase: "6",
        },
        {
          userImg: "user.jpg",
          userName: "Alireza Davoodi",
          active: "online",
          sub: "offline",
          major: "Master's student in biology Master's student... ",
          address: "Master's student in biology Master's student... ",
          star: "8543",
          cup: "22",
          increase: "6",
        },
        {
          userImg: "user.jpg",
          userName: "Alireza Davoodi",
          active: "offline",
          sub: "offline",
          major: "Master's student in biology Master's student... ",
          address: "Master's student in biology Master's student... ",
          star: "8543",
          cup: "22",
          increase: "6",
        },
        {
          userImg: "user.jpg",
          userName: "Alireza Davoodi",
          active: "long time ago",
          sub: "offline",
          major: "Master's student in biology Master's student... ",
          address: "Master's student in biology Master's student... ",
          star: "8543",
          cup: "22",
          increase: "6",
        },
      ],
      tags: [
        {
          name: "Biology(1)",
        },
        {
          name: "Biology(1)",
        },
        {
          name: "more 3+",
        },
      ],
    };
  },

  watch: {
    overlay(val) {
      val &&
        setTimeout(() => {
          this.overlay = false;
        }, 2000);
    },
  },
};
</script>
