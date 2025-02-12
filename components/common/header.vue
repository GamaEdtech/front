<template>
  <div>
    <header id="main-header">
      <!--Desktop menu-->
      <v-app-bar
        flat
        :fixed="menuSetting.fixedStatus"
        id="main-menu"
        :class="menuSetting.class"
        class="d-none d-lg-block"
         v-if="!isPageToHideHeader"
      >
        <v-container class="px-0">
          <v-row>
            <v-col cols="6" md="9" lg="9" xl="9">
              <div class="d-flex">
                <nuxt-link to="/">
                  <img
                    alt="Gamatrain"
                    id="main-logo"
                    :src="`/images/${menuSetting.logo}`"
                  />
                </nuxt-link>

                <div class="pt-2">
                  <v-btn
                    tile
                    v-for="(link, i) in menuLink"
                    :to="link.link"
                    :key="i"
                    :color="menuSetting.linkColor"
                    text
                    class="mx-2 mx-md-0 mx-lg-2 text-transform-none gtext-t4"
                  >
                    <v-icon class="mb-2 mr-1" v-if="link.icon" color="#FFB300">
                      {{ link.icon }}
                    </v-icon>
                    {{ link.title }}
                  </v-btn>
                </div>
              </div>
            </v-col>
            <v-col cols="4" md="3" lg="3" xl="3" class="text-right mt-md-1">
              <div class="d-flex text-right" v-if="$auth.loggedIn">
                <v-spacer />
                <v-menu
                  transition="slide-x-transition"
                  offset-y
                  min-width="150"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on" class="d-flex">
                      <div
                        class="gama-text-subtitle1"
                        :id="
                          menuSetting.bgColor == '#fff'
                            ? 'header-username-dark'
                            : 'header-username-light'
                        "
                      >
                        {{ userName }}
                      </div>
                      <v-avatar size="32" v-if="$auth.user.avatar">
                        <v-img :src="$auth.user.avatar" alt="user avatar" />
                      </v-avatar>
                      <v-icon v-else :color="menuSetting.linkColor">
                        mdi-account
                      </v-icon>
                    </div>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, i) in user_profile_items"
                      :key="i"
                      :to="item.link"
                    >
                      <v-list-item-icon class="mr-0 nt">
                        <v-icon small>
                          {{ item.icon }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>
                        {{ item.title }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item class="pointer" @click="$auth.logout()">
                      <v-list-item-icon class="mr-0">
                        <v-icon small> mdi-logout </v-icon>
                      </v-list-item-icon>
                      <v-list-item-title> Logout </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

                <!--Desktop version-->
                <common-notification-component
                  :menuSetting="menuSetting"
                  ref="notificationComponent"
                  class="d-none d-lg-block"
                />
              </div>
              <div v-else>
                <v-btn
                  rounded
                  class="primary text-transform-none black--text"
                  large
                  @click="openLoginDialog"
                >
                  Sign in
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-app-bar>

      <div>
        <!--Login component-->
        <login
          ref="login_modal"
          :switchToRegister.sync="currentOpenDialog"
          :switchToPassRecover.sync="currentOpenDialog"
        />
        <!--End login component-->

        <!--Register component-->
        <register
          ref="register_modal"
          :switchToLogin.sync="currentOpenDialog"
        />
        <!--End register component-->

        <!--Recover password component-->
        <pass-recover
          ref="pass_recover_modal"
          :switchToLogin.sync="currentOpenDialog"
          :switchToRegister.sync="currentOpenDialog"
        />
        <!--End recover password component-->
      </div>
      <!--End desktop menu-->

      <v-navigation-drawer
        v-model="sidebar"
        app
        class="hidden-lg-and-up main-sidebar"
      >
        <!-- Start:  Menu items -->
        <v-list dense shaped>
          <!--Profile info-->
          <v-list-group v-if="$auth.loggedIn" active-class="menu_group_active">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon v-text="'mdi-account-outline'"></v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <span v-if="$auth.user.first_name">{{
                  $auth.user.first_name
                }}</span>
                <span v-else-if="$auth.user.last_name">{{
                  $auth.user.last_name
                }}</span>
                <span v-else>No name</span>
              </v-list-item-title>
            </template>

            <v-list-item
              class="pl-7"
              v-for="(item, i) in user_profile_items"
              :key="i"
              link
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item>

            <v-list-item class="pl-7" @click="$auth.logout()">
              <v-list-item-icon>
                <v-icon v-text="'mdi-exit-to-app'"></v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text="'Logout'"></v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-if="$auth.loggedIn"
            @click="notificationListDialog = true"
          >
            <v-list-item-icon>
              <v-badge overlap content="3">
                <v-icon v-text="'mdi-bell-outline'"></v-icon>
              </v-badge>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> Notification </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="openLoginDialog" v-if="!$auth.loggedIn">
            <v-list-item-icon>
              <v-icon v-text="'mdi-account-outline'"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                <span class="primary--text">Sign in</span>
                / Sign up
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!--End Profile info-->

          <!--Mobile menu items-->
          <div v-for="(item, side) in menuItems" :key="side">
            <v-list-item
              class="py-2"
              active-class="menu_active"
              v-if="!item.subMenuList"
              :to="item.link"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" :color="item.icon_color"></v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text="item.title" class="menu-title" />
            </v-list-item>

            <v-list-group
              v-else
              active-class="menu_group_active"
              :key="item.title"
              no-action
              :value="false"
            >
              <template v-slot:activator>
                <v-list-item-title
                  v-text="item.title"
                  class="py-2"
                ></v-list-item-title>
              </template>

              <v-list-item
                class="pl-7"
                active-class="menu_active"
                v-for="(subMenuItem, side) in item.subMenuList"
                :to="subMenuItem.link"
                :key="side.title"
              >
                <v-list-item-content class="py-2">
                  <v-list-item-title
                    v-text="subMenuItem.title"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </div>
        </v-list>
        <!-- End:  Menu items -->
      </v-navigation-drawer>
      <!-- End:  show sidebar menu in mobile -->

      <!--   Start: navbar   main-container -->

      <!--Mobile nav-->
      <v-app-bar
        class="d-block d-lg-none mobile_bar"
        fixed
        flat
        :class="menuSetting.class"
      >
        <v-icon
          @click="sidebar = !sidebar"
          class="px-2"
          :class="menuSetting.bgColor == '#fff' ? '' : 'white--text '"
        >
          mdi-menu
        </v-icon>
        <!--Logo section-->
        <nuxt-link to="/">
          <img id="main-logo" :src="`/images/${menuSetting.logo}`" />
        </nuxt-link>
        <!--End logo section-->

        <v-spacer></v-spacer>

        <!--   hamburgers-icon in mobile-->

        <div class="text-center">
          <v-bottom-sheet v-model="mobileSearchSheet">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                :color="menuSetting.linkColor"
                class="pa-23"
              >
                mdi-magnify
              </v-icon>
            </template>
            <v-sheet
              id="mobile-search-sheet"
              :height="`${mobileSearchSheetConfig.sheetHeight}vh`"
            >
              <div
                id="search-sheet-handler-holder"
                @touchstart="startDrag"
                @touchend="endDrag"
                @touchmove="handleDrag"
              >
                <div id="search-sheet-handler"></div>
              </div>
              <v-slide-group
                id="search-cate-slide"
                center-active
                class="pt-4"
                show-arrows
              >
                <v-slide-item
                  v-for="(item, n) in searchFilterItems"
                  class="slide-item"
                  :class="mobileSearchFilter == item.key ? 'active-item' : ''"
                  :key="n"
                >
                  <div @click="setActiveFilter(item.key)">
                    <div :class="`active-avatar active-${item.key}-avatar`">
                      <div :class="`avatar ${item.key}-avatar`">
                        <span :class="`icon icon-${item.key}`"></span>
                      </div>
                    </div>
                    <div class="gama-text-caption">{{ item.title }}</div>
                  </div>
                </v-slide-item>
              </v-slide-group>
              <v-card flat>
                <v-card flat>
                  <div id="keyword-card">
                    <v-row>
                      <v-col cols="12" class="pb-0 px-6">
                        <v-text-field
                          ref="mobileKeywordInput"
                          class="rounded-ts pr-0"
                          dense
                          outlined
                          hide-details
                          v-model="searchKey"
                          label="Ex: Paper Summer Session"
                        >
                          <template slot="append">
                            <v-icon
                              v-if="searchResultsSection"
                              @click="closeSearch()"
                            >
                              mdi-close-circle
                            </v-icon>
                          </template>
                          <template slot="append-outer">
                            <v-btn dense color="#FFB300" class="white--text">
                              <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                          </template>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" class="pt-0">
                        <div
                          id="mobile-search-result-container"
                          v-if="searchResultsSection"
                        >
                          <div
                            id="search-result"
                            ref="mobileSearchResult"
                            @scroll="checkSearchScroll"
                          >
                            <div id="result-stat">
                              <span class="gama-text-overline">
                                Search result
                              </span>
                              <span class="gama-text-button">
                                {{ searchCount }}
                              </span>
                            </div>
                            <div v-if="searchCount > 0">
                              <v-row
                                class="list-item"
                                v-for="(item, index) in searchResults"
                                :key="index"
                              >
                                <v-col cols="1">
                                  <nuxt-link
                                    :to="`/${calcPath(item.type)}/${item.id}`"
                                  >
                                    <div
                                      v-if="item.type == 'gama_tests'"
                                      class="avatar paper-avatar"
                                    >
                                      <span class="icon icon-paper"></span>
                                    </div>
                                    <div
                                      v-else-if="item.type == 'gama_learnfiles'"
                                      class="avatar multimedia-avatar"
                                    >
                                      <span class="icon icon-multimedia"></span>
                                    </div>
                                    <div
                                      v-else-if="item.type == 'gama_azmoons'"
                                      class="avatar exam-avatar"
                                    >
                                      <span class="icon icon-exam"></span>
                                    </div>
                                    <div
                                      v-else-if="item.type == 'gama_questions'"
                                      class="avatar qa-avatar"
                                    >
                                      <span class="icon icon-q-a"></span>
                                    </div>
                                    <div
                                      v-else-if="item.type == 'gama_dars'"
                                      class="avatar tutorial-avatar"
                                    >
                                      <span class="icon icon-tutorial"></span>
                                    </div>
                                    <div
                                      v-else-if="item.type == 'gama_teachers'"
                                      class="avatar teacher-avatar"
                                    >
                                      <span class="icon icon-teacher"></span>
                                    </div>
                                    <div
                                      v-else-if="item.type == 'gama_schools'"
                                      class="avatar school-avatar"
                                    >
                                      <span class="icon icon-school"></span>
                                    </div>
                                    <div
                                      v-else-if="item.type == 'gama_live'"
                                      class="avatar live-avatar"
                                    >
                                      <span class="icon icon-live"></span>
                                    </div>
                                    <div
                                      v-else-if="item.type == 'gama_students'"
                                      class="avatar student-avatar"
                                    >
                                      <span class="icon icon-live"></span>
                                    </div>
                                  </nuxt-link>
                                </v-col>
                                <v-col cols="11">
                                  <div class="gama-text-button ml-2">
                                    <nuxt-link
                                      :to="`/${calcPath(item.type)}/${item.id}`"
                                      >{{ item.title }}</nuxt-link
                                    >
                                  </div>
                                  <div class="chip-container ml-2">
                                    <div class="chip" v-if="item.lesson_title">
                                      <nuxt-link
                                        :to="`/search?type=test&section=${item.section}&base=${item.base}&lesson=${item.lesson}`"
                                        >{{ item.lesson_title }}</nuxt-link
                                      >
                                    </div>
                                    <div class="chip" v-if="item.base_title">
                                      <nuxt-link
                                        :to="`/search?type=test&section=${item.section}&base=${item.base}`"
                                        >{{ item.base_title }}</nuxt-link
                                      >
                                    </div>
                                    <div class="chip" v-if="item.section_title">
                                      <nuxt-link
                                        :to="`/search?type=test&section=${item.section}`"
                                        >{{ item.section_title }}</nuxt-link
                                      >
                                    </div>
                                  </div>
                                </v-col>
                              </v-row>
                              <v-row
                                v-if="allDataLoaded == false"
                                class="list-item"
                              >
                                <v-col cols="12">
                                  <v-skeleton-loader
                                    type="list-item-avatar"
                                  ></v-skeleton-loader>
                                </v-col>
                              </v-row>
                            </div>
                            <div
                              v-else-if="
                                searchCount == 0 && searchLoading == false
                              "
                              class="text-center"
                            >
                              <span class="gama-text-button">
                                Opps! no data found
                              </span>
                            </div>
                            <div v-else>
                              <v-row class="list-item" v-for="i in 3" :key="i">
                                <v-col cols="12">
                                  <v-skeleton-loader
                                    type="list-item-avatar"
                                  ></v-skeleton-loader>
                                </v-col>
                              </v-row>
                            </div>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </v-card>
              </v-card>
            </v-sheet>
          </v-bottom-sheet>
        </div>

        <v-btn
          v-if="!$auth.loggedIn"
          :small="$vuetify.breakpoint.smAndUp"
          :x-small="$vuetify.breakpoint.xs"
          rounded
          id="mobile-signin-btn"
          class="primary gama-btn"
          @click="openLoginDialog"
        >
          Sign in
        </v-btn>
        <common-notification-component
          v-if="$auth.loggedIn"
          :menuSetting="menuSetting"
          ref="notificationComponent"
          class="d-block d-lg-none"
        />
        <v-menu
          v-if="$auth.loggedIn"
          transition="slide-x-transition"
          offset-y
          min-width="150"
        >
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on">
              <v-avatar v-if="$auth.user.avatar" class="ml-2">
                <v-img :src="$auth.user.avatar" alt="user avatar" />
              </v-avatar>
              <v-icon v-else class="ml-2" :color="menuSetting.linkColor">
                mdi-account
              </v-icon>
            </div>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in user_profile_items"
              :key="i"
              :to="item.link"
            >
              <v-list-item-icon class="mr-0 nt">
                <v-icon small>
                  {{ item.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item class="pointer" @click="$auth.logout()">
              <v-list-item-icon class="mr-0">
                <v-icon small> mdi-logout </v-icon>
              </v-list-item-icon>
              <v-list-item-title> Logout </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
      <!--End mobile nav-->

      <!--   End: navbar   -->
    </header>

    <v-dialog
      v-model="notificationListDialog"
      fullscreen
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card id="notificationListCard">
        <v-card-text>
          <v-toolbar flat>
            <h2 class="main-title">Notifications</h2>
            <v-spacer></v-spacer>

            <v-btn icon @click="notificationListDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-list three-line>
            <template v-for="(item, index) in notificationItems">
              <v-list-item :key="index">
                <v-list-item-icon>
                  <v-icon :icon="item.icon"></v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <div class="date">{{ item.date }}</div>
                  <v-list-item-title
                    class="title"
                    v-html="item.title"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    class="describe"
                    v-html="item.describe"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Login from "@/components/common/login";
import Register from "@/components/common/register";
import SearchBox from "@/components/common/search-box";
import PassRecover from "@/components/common/pass-recover";
import NotificationComponent from "~/components/common/notification-component.vue";

export default {
  name: "header-component",
  components: {
    NotificationComponent,
    Login,
    Register,
    PassRecover,
    SearchBox,
  },
  data() {
    return {
      sidebar: false,
      dialog: false,
      logo: "mainlogo-gamatrain.png",
      avatar: "dexter-morse.png",
      isPageToHideHeader: this.$route.name === 'admin',
      menuItems: [
        {
          title: "About us",
          link: "/about-us",
          icon: "mdi-account-multiple",
          icon_color: "",
        },
        {
          title: "Services",
          link: "/services",
          icon: "mdi-view-module",
          icon_color: "",
        },
        {
          title: "Faq",
          link: "/faq",
          icon: "mdi-information",
          icon_color: "",
        },
        // {
        //   title: "Offers",
        //   link: "/offers",
        //   icon: "mdi-wallet-giftcard",
        //   icon_color: 'primary'
        // },
      ],
      selectedItem: 1,
      socialList: [
        { link: "telegram", icon: "fa-telegram" },
        { link: "twitter", icon: "fa-twitter" },
        { link: "instagram", icon: "fa-instagram" },
        { link: "Youtube", icon: "fa-youtube" },
      ],
      hotTopics: {},

      menuLink: [
        {
          title: "Home",
          link: "/",
          icon: "",
        },
        {
          title: "About us",
          link: "/about-us",
          icon: "",
        },
        {
          title: "Services",
          link: "/services",
          icon: "",
        },
        {
          title: "FAQ",
          link: "/faq",
          icon: "",
        },
        // {
        //   title: 'Offers',
        //   link: '/offers',
        //   icon: 'mdi-wallet-giftcard'
        // },
      ],
      currentOpenDialog: "",
      mobileSearchSheet: false,
      mobileSearchSheetConfig: {
        isDragging: false,
        startDragY: 0,
        sheetHeight: 70,
      },
      searchFilterItems: [
        {
          title: "Past Papers",
          key: "paper",
        },
        {
          title: "Multimedia",
          key: "multimedia",
        },
        {
          title: "QuizHub",
          key: "exam",
        },
        {
          title: "Forum",
          key: "q-a",
        },
        {
          title: "Tutorial",
          key: "tutorial",
        },
        {
          title: "Teacher",
          key: "teacher",
        },
        {
          title: "Student",
          key: "student",
        },
      ],
      mobileSearchFilter: "exam",
      keyword: "",

      user_profile_items: [
        {
          title: "Dashboard",
          icon: "mdi-view-dashboard",
          link: "/user",
        },
        {
          title: "Messages",
          icon: "mdi-email-outline",
          link: "/user/ticket",
        },
        {
          title: "Edit Profile",
          icon: "mdi-account-outline",
          link: "/user/profile",
        },
        {
          title: "Change Password",
          icon: "mdi-key",
          link: "/user/edit-pass",
        },
      ],
      notificationListDialog: false,
      notificationItems: [
        {
          icon: "mdi-table-furniture",
          date: "Today, 11:48 am",
          title: "Sample Question uploded",
          describe:
            "Satisfied course question sample has been uploaded for your level of education.",
        },
        {
          icon: "mdi-map-marker-check",
          date: "Today, 11:48 am",
          title: "Sample Question uploded",
          describe:
            "Satisfied course question sample has been uploaded for your level of education.",
        },
      ],

      menuSetting: {
        logo: "gamatrain-logo-black.svg",
        bgColor: "#fff",
        fixedStatus: false,
        linkColor: "#424A53",
        class: "",
      },

      //Search section
      searchResults: [],
      searchCount: "...",
      searchKey: "",
      searchCate: "",
      searchLoading: true,
      pageNum: 1,
      timer: 0,
      searchResultsSection: false,
      allDataLoaded: false,
      //End search section
    };
  },

  mounted() {
    // if (window.innerWidth <= 960 && this.$auth.loggedIn) {
    //   this.$refs["notification-section"].getNotifications();
    // }

    if (
      this.$route.name == "index" ||
      this.$route.name == "smart-learning" ||
      this.$route.name == "services" ||
      this.$route.name == "school-service" ||
      this.$route.name == "faq" ||
      this.$route.name == "terms" ||
      this.$route.name == "about-us" ||
      this.$route.name == "earn-money"
    ) {
      if (window.scrollY > 60) {
        this.menuSetting = {
          logo: "gamatrain-logo-black.svg",
          bgColor: "#fff",
          fixedStatus: true,
          linkColor: "#424A53",
          class: "",
        };
      } else {
        this.menuSetting = {
          logo: "gamatrain-logo.svg",
          bgColor: "#000",
          fixedStatus: true,
          linkColor: "#fff",
          class: "transparentMenu",
        };
      }
    }
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  async fetch() {
    await this.$axios
      .$get("/api/v1/admin/values")
      .then((response) => {
        if (response.data.mostVisitedTags.enable == "true")
          this.hotTopics = response.data.mostVisitedTags.tags;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    openLoginDialog() {
      this.$refs.login_modal.login_dialog = true;
    },
    openRegisterDialog() {
      this.$refs.register_modal.register_dialog = true;
    },

    handleScroll() {
      if (
        this.$route.name == "index" ||
        this.$route.name == "smart-learning" ||
        this.$route.name == "services" ||
        this.$route.name == "school-service" ||
        this.$route.name == "faq" ||
        this.$route.name == "terms" ||
        this.$route.name == "about-us" ||
        this.$route.name == "earn-money"
      )
        if (window.scrollY > 60) {
          this.menuSetting = {
            logo: "gamatrain-logo-black.svg",
            bgColor: "#fff",
            fixedStatus: true,
            linkColor: "#424A53",
            class: "",
          };
        } else {
          this.menuSetting = {
            logo: "gamatrain-logo.svg",
            bgColor: "#000",
            fixedStatus: true,
            linkColor: "#fff",
            class: "transparentMenu",
          };
        }
    },
    setActiveFilter(val) {
      this.mobileSearchFilter = val;
    },

    //Search section
    checkSearchScroll() {
      const scrollableDiv = this.$refs.mobileSearchResult;
      if (this.isScrollAtBottom(scrollableDiv) && this.allDataLoaded == false) {
        this.pageNum++;
        this.search();
      }
    },
    isScrollAtBottom(element) {
      return element.scrollHeight - element.scrollTop <= element.clientHeight;
    },
    search() {
      this.searchLoading = true;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        if (this.searchKey && this.allDataLoaded == false)
          this.$axios
            .$get("/api/v1/search/text", {
              params: {
                query: this.searchKey,
                page: this.pageNum,
              },
            })
            .then((response) => {
              this.searchCount = response.data.num;
              this.searchResults.push(...response.data.list);

              if (response.data.list.length === 0) this.allDataLoaded = true;
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              this.searchLoading = false;
            });
      }, 800);
    },
    closeSearch() {
      this.searchResultsSection = false;
      this.searchKey = "";
      this.$refs.mobileKeywordInput.blur();
    },
    calcPath(type) {
      if (type == "gama_tests") return "paper";
      else if (type == "gama_learnfiles") return "multimedia";
      else if (type == "gama_azmoons") return "exams";
      else if (type == "gama_questions") return "qa";
      else if (type == "gama_dars") return "tutorial";
      else if (type == "gama_teachers") return "teacher";
      else if (type == "gama_schools") return "school";
      else if (type == "gama_live") return "live";
      else if (type == "gama_students") return "student";
    },

    startDrag(e) {
      this.mobileSearchSheetConfig.isDragging = true;
      this.mobileSearchSheetConfig.startDragY = e.touches[0].clientY;
    },
    handleDrag(e) {
      if (this.mobileSearchSheetConfig.isDragging) {
        e.preventDefault();

        const currentY = e.touches[0].clientY;
        const dragDistance = this.mobileSearchSheetConfig.startDragY - currentY;
        const viewportHeight = window.innerHeight;

        const currentHeight = this.mobileSearchSheetConfig.sheetHeight;
        const newHeightVH =
          currentHeight + (dragDistance / viewportHeight) * 100;

        // Limit the newHeightVH to reasonable values
        const newHeight = Math.min(Math.max(newHeightVH, 10), 100); // 10vh to 100vh

        this.mobileSearchSheetConfig.sheetHeight = newHeight;
        this.mobileSearchSheetConfig.startDragY = currentY;
      }
    },
    endDrag(e) {
      this.mobileSearchSheetConfig.isDragging = false;
      if (this.mobileSearchSheetConfig.sheetHeight < 30)
        this.mobileSearchSheet = false;
    },
    //End search section
  },
  watch: {
    currentOpenDialog(val) {
      if (val === "login") {
        this.$refs.register_modal.register_dialog = false;
        this.$refs.pass_recover_modal.pass_recover_dialog = false;
        this.$refs.login_modal.login_dialog = true;
      } else if (val === "register") {
        this.$refs.login_modal.login_dialog = false;
        this.$refs.pass_recover_modal.pass_recover_dialog = false;
        this.$refs.register_modal.register_dialog = true;
      } else if (val === "pass_recover") {
        this.$refs.login_modal.login_dialog = false;
        this.$refs.register_modal.register_dialog = false;
        this.$refs.pass_recover_modal.pass_recover_dialog = true;
      } else {
        this.$refs.login_modal.login_dialog = false;
        this.$refs.login_modal.register_dialog = false;
        this.$refs.pass_recover_modal.pass_recover_dialog = false;
      }
    },

    //Handle auth form from all of section
    "$route.query.auth_form"(val) {
      if (val === "login") {
        this.$refs.login_modal.login_dialog = true;
        this.$router.push({ query: {} });
      } else if (val == "register") {
        this.$refs.register_modal.register_dialog = true;
        this.$router.push({ query: {} });
      }
    },

    "$route.name"(val) {
      this.mobileSearchSheet = false;

      if (
        val == "index" ||
        val == "smart-learning" ||
        val == "services" ||
        val == "school-service" ||
        val == "faq" ||
        val == "terms" ||
        val == "about-us" ||
        val == "earn-money"
      ) {
        this.menuSetting = {
          logo: "gamatrain-logo.svg",
          bgColor: "#000",
          fixedStatus: true,
          linkColor: "#fff",
          class: "transparentMenu",
        };
      } else {
        this.menuSetting = {
          logo: "gamatrain-logo-black.svg",
          bgColor: "#fff",
          fixedStatus: false,
          linkColor: "#424A53",
          class: "",
        };
      }
    },

    searchKey(val) {
      if (val.trim() === "") {
        this.searchResultsSection = false;
      } else {
        this.searchResultsSection = true;
      }
      this.pageNum = 1;
      this.searchCount = "...";
      this.allDataLoaded = false;
      this.searchResults = [];
      this.search();
    },
    mobileSearchSheet(val) {
      if (val == true) this.mobileSearchSheetConfig.sheetHeight = 70;
    },
  },
  computed: {
    userName() {
      if (this.$auth.user.first_name) return this.$auth.user.first_name;
      else if (this.$auth.user.last_name) return this.$auth.user.last_name;
      else return "No name";
    },
  },
};
</script>

<style>
.v-application .primary {
  background-color: #ffb300 !important;
  border-color: #ffb300 !important;
}

.v-application .primary--text {
  color: #ffb300 !important;
}

.transparentMenu {
  background: transparent !important;
}

#main-header {
  .v-icon {
    font-size: 2rem;
  }

  .v-avatar {
    min-width: 2rem !important;
    width: 2rem !important;
    height: 2rem !important;
  }
}

.mobile_bar {
  z-index: 1005 !important;
}

.main-sidebar {
  z-index: 1006 !important;
}

#main-logo {
  margin-left: 1.6rem !important;
  width: 8.0551rem !important;
  height: 2rem !important;
}

#mobile-signin-btn {
  margin-left: 1.6rem;
}

#mobile-search-sheet {
  height: 70vh;
  border-radius: 3rem 3rem 0 0;
  justify-content: center;
  align-items: center;
  background: #f6f8fa;
  position: relative;
  padding-top: 5.6rem;

  #search-sheet-handler-holder {
    position: absolute;
    width: 100%;
    height: 6.4rem;
    border-radius: 10rem;
    opacity: 0.4;
    top: 0;
    left: 0;
    right: 0;
    background: transparent;
    margin: auto;
    #search-sheet-handler {
      position: absolute;
      width: 3.2rem;
      height: 0.4rem;
      border-radius: 10rem;
      opacity: 0.4;
      top: 1.6rem;
      left: 0;
      right: 0;
      background: var(--m-3-sys-light-outline, #79747e);
      margin: auto;
    }
  }

  #search-cate-slide {
    .slide-item {
      margin-right: 2.4rem;
      margin-left: 2.4rem;

      .avatar {
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 2.6rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1.2rem auto 0.8rem auto;

        .icon {
          font-size: 2.13rem;
          color: #ffffff;
        }
      }

      .paper-avatar {
        background: #01c8c8;
      }

      .multimedia-avatar {
        background: #8800b8;
      }

      .exam-avatar {
        background: #7b61ff;
      }

      .q-a-avatar {
        background: #ff50a6;
      }

      .tutorial-avatar {
        background: #2a91ff;
      }

      .student-avatar {
        background: #ff9400;
      }

      .teacher-avatar {
        background: #1cb423;
      }

      .school-avatar {
        background: #a15801;
      }

      .live-avatar {
        background: #ff0000;
      }

      .gama-text-caption {
        color: rgba(36, 41, 47, 0.5);
      }
    }

    .active-item {
      margin-right: 2.1rem;
      margin-left: 2.1rem;

      .avatar {
        width: 4.8rem;
        height: 4.8rem;
        border-radius: 2.6rem;
        margin: auto auto;

        .icon {
          font-size: 3.2rem;
        }
      }

      .active-avatar {
        width: 5.6rem;
        height: 5.6rem;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto 0.8rem auto;
      }

      .active-paper-avatar {
        background: #bbe9bd;
      }

      .active-multimedia-avatar {
        background: #dcb3ea;
      }

      .active-exam-avatar {
        background: #d8d0ff;
      }

      .active-q-a-avatar {
        background: #ffcbe4;
      }

      .active-tutorial-avatar {
        background: #c0deff;
      }

      .active-student-avatar {
        background: #ffdfb3;
      }

      .active-teacher-avatar {
        background: #1cb4234d;
      }

      .active-school-avatar {
        background: #e3cdb3;
      }

      .active-live-avatar {
        background: #ffb3b3;
      }

      .gama-text-caption {
        color: rgba(36, 41, 47, 0.8);
        text-align: center;
        font-family: Inter;
        font-size: 1.4rem;
        font-style: normal;
        font-weight: 400;
        line-height: 2.4rem;
      }
    }
  }

  .v-card {
    background: transparent;

    .v-skeleton-loader__list-item-avatar {
      background: transparent;
    }

    .v-icon {
      font-size: 2.4rem;
      color: #ff9400;
    }

    #keyword-card {
      .v-text-field {
        width: 42.8rem;
        min-height: auto;
        height: 4rem !important;
        border-radius: 3.8rem 0.4rem 0.4rem 3.8rem;

        margin: 1.6rem auto 1.6rem auto;

        .v-input__control > .v-input__slot {
          min-height: auto;
          height: 4rem !important;

          &:before {
            border-style: none;
          }
        }

        .v-input__append-outer {
          margin: 0 0 0 0.8rem !important;

          .v-btn {
            min-width: auto;
            width: 3.9rem !important;
            height: 3.9rem;
            border-radius: 0.4rem 3.8rem 3.8rem 0.4rem;

            .v-icon {
              color: #000;
              font-size: 2.2rem;
            }
          }
        }
      }
    }
  }

  #mobile-search-result-container {
    display: block;
    margin: auto;
    z-index: 4;
    min-height: 40vh;
    height: 40vh;
    overflow: hidden;

    #search-result {
      max-height: 40vh;
      overflow-x: hidden;
      overflow-y: scroll;
      position: relative;

      #result-stat {
        padding: 1.6rem;
        text-align: right;
        position: sticky;
        background: #f6f8fa;
        top: 0;

        .gama-text-button {
          color: #57b947;
          text-align: right;
        }

        .gama-text-overline {
          color: rgba(36, 41, 47, 0.3);
          margin-right: 0.22rem;
        }
      }

      .list-item {
        height: 11.9rem;
        padding: 1.6rem;

        .gama-text-button {
          color: rgba(36, 41, 47, 0.8);
          margin-bottom: 1.7rem;
          white-space: nowrap;
          width: inherit;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .avatar {
          width: 3.2rem;
          height: 3.2rem;
          border-radius: 2.6rem;
          display: flex;
          justify-content: center;
          align-items: center;

          .icon {
            font-size: 2.13rem;
            color: #ffffff;
          }
        }

        .paper-avatar {
          background: #01c8c8;
        }

        .multimedia-avatar {
          background: #8800b8;
        }

        .exam-avatar {
          background: #7b61ff;
        }

        .qa-avatar {
          background: #ff50a6;
        }

        .tutorial-avatar {
          background: #2a91ff;
        }

        .student-avatar {
          background: #ff9400;
        }

        .teacher-avatar {
          background: #1cb423;
        }

        .school-avatar {
          background: #a15801;
        }

        .live-avatar {
          background: #ff0000;
        }

        .chip-container {
          display: flex;

          .chip {
            height: 2.4rem;
            padding: 0.2rem 0.8rem 0.2rem 0.8rem;
            width: max-content;
            border-radius: 2rem;
            background: rgba(36, 41, 47, 0.05);
            margin-right: 0.8rem;

            color: rgba(36, 41, 47, 0.8);
            font-family: Inter;
            font-size: 1.2rem;
            font-style: normal;
            font-weight: 400;
            line-height: 2rem;
            max-width: 18.4rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .v-skeleton-loader__list-item-avatar {
          background: transparent;
        }
      }

      .list-item:nth-child(even) {
        background: rgba(36, 41, 47, 0.05);
      }
    }
  }
}

@media (min-width: 600px) {
  #main-header {
    .v-icon {
      font-size: 2.4rem;
    }

    .v-avatar {
      min-width: 2.4rem !important;
      width: 2.4rem !important;
      height: 2.4rem !important;
    }
  }

  #mobile-signin-btn {
    margin-left: 1.6rem;
  }

  #main-logo {
    margin-left: 3rem !important;
    width: 1.6458rem;
    height: 1.6511rem;
  }

  #mobile-search-sheet {
    height: 50vh;
    border-radius: 3rem 3rem 0 0;
    justify-content: center;
    align-items: center;

    .v-icon {
      font-size: 2.4rem;
      color: #ff9400;
    }

    .title {
      margin-top: 0.2rem;
      color: #424a53;
      text-align: center;
      font-size: 1.2rem;
      font-style: normal;
      font-weight: 300;
      line-height: 1.6rem;
    }

    #keyword-card {
      .v-icon {
        font-size: 2.4rem;
        color: #000000;
      }

      .primary--text {
        color: #000 !important;
      }
    }
  }
}

@media (min-width: 960px) {
  #main-header {
    .menu-item:hover {
      border-bottom: 3px solid rgb(0, 139, 139);
    }

    .v-icon {
      font-size: 2.8rem;
    }

    .v-avatar {
      min-width: 2.8rem;
      width: 2.8rem;
      height: 2.8rem;
    }

    #header-username-light {
      color: #fff;
      margin-top: 0.2rem;
      min-width: 6.2rem;
      margin-right: 1rem;
    }

    #header-username-dark {
      color: #000;
      margin-top: 0.2rem;
      min-width: 6.2rem;
      margin-right: 1rem;
    }

    #main-menu {
      z-index: 1001;
      padding-bottom: 0.4rem;
      height: 6.4rem !important;

      .v-btn {
        font-size: 1.8rem;
        font-style: normal;
        font-weight: 400;
        font-family: "Inter";
        line-height: normal;
        padding-bottom: 0.1rem !important;
      }

      .v-btn--active {
        border-bottom: 0.2rem solid #ffb300 !important;

        .v-btn__overlay {
          opacity: 0;
        }
      }
    }

    .menu_active {
      border-bottom: 4px solid white !important;
      background-color: rgba(255, 179, 0, 0.1) !important;
      color: #ffb300f3 !important;
    }

    .menu_group_active {
      border-bottom: 4px solid white !important;
      background-color: #e1e2e3;
      color: #000 !important;
    }

    .mobile_bar .v-toolbar__content {
      background: transparent;
      padding: 0 1.4rem 0 0.5rem !important;
    }

    .mobile_bar .fa-bell {
      line-height: 3rem !important;
      font-size: 2.8rem !important;
    }
  }

  #notificationListCard {
    .main-title {
      color: #424a53;
      font-size: 1.6rem !important;
      font-style: normal;
      font-weight: 750;
      line-height: 4.4rem;
    }

    .v-list-item__icon {
      margin-right: 1rem;

      .v-icon {
        font-size: 2.4rem;
        color: #ffb600 !important;
      }
    }

    .title {
      color: #424a53;
      font-size: 1.4rem;
      font-style: normal;
      font-weight: 500;
      line-height: 2rem;
    }

    .describe {
      color: #6e7781;
      font-size: 1.2rem;
      font-style: normal;
      font-weight: 300;
      line-height: 2rem;
    }

    .date {
      color: #6e7781;
      font-size: 1rem;
      font-style: normal;
      font-weight: 500;
    }
  }
}

@media (min-width: 1264px) {
  #main-logo {
    width: 12.0827rem !important;
    height: 3.2rem !important;
    margin-top: 0.6rem;
    margin-right: 6.4rem;
    margin-left: 0 !important;
  }
}
</style>
