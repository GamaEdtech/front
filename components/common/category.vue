<template>
  <div id="main-category " class="mt-md-16">
    <!--   Start: category  main-container Desktop -->
    <v-container id="main-category-container">
      <v-row>
        <v-col cols="12">
          <v-sheet class="category-sheet mx-auto">
            <div class="d-flex overflow-x-auto">
              <div v-for="(item, category) in items" :key="category" class="mx-2">
                <div class="category-itm-content">
                  <v-btn
                    class="category-btn"
                    :to="item.link"
                    :color="item.color"
                    depressed
                  >
                    <span :class="item.icon" class="icon white--text"></span>
                  </v-btn>
                  <div :style="`color:${item.color}`" class="category-text">
                    {{ item.text }}
                  </div>
                </div>
              </div>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <!--   End: category    -->
  </div>
</template>

<script>
export default {
  data: () => ({
    selectedItem: 1,
    showMore: false,
    items: [
      {
        class: "test",
        color: "#01579b",
        text: "Past Papers",
        icon: "icon-paper",
        link: "/search?type=test",
      },
      {
        class: "content",
        color: "#2e7d32",
        text: "Multimedia",
        icon: "icon-multimedia",
        link: "/search?type=learnfiles",
      },
      {
        class: "faq",
        color: "#bf360c",
        text: "Forum",
        icon: "icon-q-a",
        link: "/search?type=question",
      },
      {
        class: "exam",
        color: "#5600e8",
        text: "QuizHub",
        icon: "icon-exam",
        link: "/search?type=azmoon",
      },
      {
        class: "textbook",
        color: "#bd081c",
        text: "Tutorial",
        icon: "icon-tutorial",
        link: "/search?type=dars",
      },
      {
        class: "school",
        color: "#a5673f",
        text: "School",
        icon: "icon-school",
        link: "/school",
        status: "disabled",
      },
      // {
      //   class: "tutor",
      //   color:"#8e24aa",
      //   text: "Tutor",
      //   icon: "icon-teacher",
      //   link: "/search?type=tutor",
      //   status: "disabled",
      // },
    ],
  }),
};
</script>

<style scoped>
#main-category-container {
  margin-top: 6rem;
  width: 40rem;
  margin-left: auto;
  margin-right: auto;
}

#main-category-container .category-sheet {
  max-width: 100%;
}

#main-category-container .category-itm-content {
  margin-left: 1rem;
  margin-right: 1rem;
  text-align: center;
}

#main-category-container .category-btn {
  border-radius: 15%;
  height: 4rem;
  min-width: 4rem !important;
  width: 4rem !important;
}

#main-category-container .category-text {
  font-size: 1.2rem;
  font-weight: 400;
  margin-top: 0.5rem;
}

#main-category-container .icon {
  font-size: 2.5rem !important;
}

#main-category .icon {
  color: #ffffff !important;
}

@media (min-width: 600px) {
  #main-category-container {
    width: 55rem;
  }
  
  #main-category-container .category-itm-content {
    margin-left: 1.5rem;
    margin-right: 1.5rem;
    text-align: center;
  }
  
  #main-category-container .category-btn {
    border-radius: 15%;
    height: 5rem !important;
    width: 5rem !important;
  }
  
  #main-category-container .category-text {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1rem;
  }
  
  #main-category-container .icon {
    font-size: 3.5rem !important;
  }
}

@media (min-width: 960px) {
  #main-category-container {
    margin-top: 8rem;
    width: 80rem;
  }
  
  #main-category-container .category-sheet {
    max-width: 90%;
  }
  
  #main-category-container .category-itm-content {
    margin-left: 2rem;
    margin-right: 2rem;
    text-align: center;
  }
  
  #main-category-container .category-btn {
    border-radius: 15%;
    height: 6rem !important;
    width: 6rem !important;
  }
  
  #main-category-container .category-text {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1rem;
  }
  
  #main-category-container .icon {
    font-size: 3.5rem !important;
  }
}

@media (min-width: 1264px) {
  #main-category-container {
    margin-top: 2rem;
    max-width: 80rem;
    width: 80rem;
  }
  
  #main-category-container .category-itm-content {
    margin-left: 2rem;
    margin-right: 2rem;
    text-align: center;
  }
  
  #main-category-container .category-btn {
    border-radius: 15%;
    height: 6rem;
    width: 6rem;
  }
  
  #main-category-container .category-text {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1rem;
  }
  
  #main-category-container .icon {
    font-size: 3.5rem !important;
  }
}
</style>
