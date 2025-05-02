<template>
  <!--Test maker menu-->
  <v-row id="test_maker_menu" >
    <v-col cols="12" class="px-0 pb-0 mb-0">
      <v-tabs
        background-color="teal"
        dark
        grow
        icons-and-text
        centered
        v-model="active_tab"
        active-class="tab_actived"
        class="fixed-tabs-bar"
      >
        <v-tab
          @click="openLink(item)"
          :disabled="item.status"
          v-for="(item,index) in items"
          :key="index"
        >

          <span>{{ item.title }}</span>
          <v-btn icon>
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </v-btn>

        </v-tab>

      </v-tabs>
    </v-col>

    <v-bottom-sheet v-model="sheet">

      <v-list>
        <v-list-item
          :to="sub_item.link"
          v-for="sub_item in subList"
          :key="sub_item.title"
          @click="sheet = false"
        >
          <v-list-item-icon>
            <v-icon>{{ sub_item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-h6">{{ sub_item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-bottom-sheet>
  </v-row>
  <!--End dashboard mobile menu-->
</template>

<script>
export default {
  name: "test-maker-menu",
  data() {
    return {
      active_tab: 0,
      items: [
        {
          title: 'Manage',
          icon: 'mdi-format-list-checkbox',
          link: '',
          subMenuList: [
            {title: "My Exams", link: "/user/exam", icon: 'mdi-clipboard-list-outline', icon_type: 'custom',status:true},
            {title: "Albums", link: "/test-maker", icon: 'mdi-image-album', icon_type: 'custom',status:true},
            {title: "Results", link: "/exam/results", icon: 'mdi-list-status', icon_type: 'custom',status:true}
          ]

        },
        {
          title: 'New Exam',
          icon: 'mdi-plus-circle-outline',
          link: '/test-maker/create',
        },
        {
          title: 'Test list',
          icon: 'mdi-list-box-outline',
          link: '/test-maker/create?active=test_list',
        },
        {
          title: 'Add New Test',
          icon: 'mdi-plus-circle-outline',
          link: '/test-maker/create?active=add_test',
          // status:(this.$auth && this.$auth.user.group_id === '6' ? true : false)
        },

      ],
      sheet: false,
      subList: [],

    }
  },
  methods: {
    openLink(item) {
      if (!item.subMenuList)
        this.$router.push({path: item.link});
      else {
        this.subList = item.subMenuList;
        this.sheet = true;
      }
    }
  }
}
</script>

<style scoped>

</style>
