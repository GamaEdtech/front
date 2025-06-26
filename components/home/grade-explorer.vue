<template>
  <v-container id="content-stats-container">
    <v-card flat>
      <v-card-text>
        <div class="ex-selector">
          <div class="ex-board-select">
            <v-select
              color="#4C4AFF"
              base-color="#4C4AFF"
              bg-color="#4C4AFF"
              v-model="selectedBoard"
              :items="boardList"
              density="compact"
              item-title="title"
              item-value="id"
              @update:modelValue="fetchGradeList"
              hide-details
              return-object
            >
              <template v-slot:selection="{ item, props }">
                <div class="d-flex align-center ex-select-board-label pr-5">
                  <div>
                    <v-avatar size="small">
                      <v-img :src="selectedBoard.img" />
                    </v-avatar>
                  </div>
                  <div class="pl-2 ex-select-board-label">
                    <span class="ex-select-board-title">
                      {{ selectedBoard.title }}
                    </span>
                  </div>
                </div>
              </template>
            </v-select>
          </div>
          <div class="ex-grade-select">
            <v-select
              color="#4C4AFF"
              base-color="#4C4AFF"
              bg-color="#4C4AFF"
              v-model="selectedGrade"
              :items="gradeList"
              density="compact"
              item-title="title"
              item-value="id"
              hide-details
            >
            </v-select>
          </div>
        </div>
        <div class="mt-10">
          <v-row justify="center">
            <v-col
              cols="12"
              sm="4"
              md="3"
              lg="2"
              v-for="category in categories"
            >
              <nuxt-link to="/">
                <div class="ex-category__card">
                  <div class="d-flex align-center">
                    <div class="ex-category__card--title mb-sm-4 pr-6 pr-md-0">
                      {{ category.stat }}
                    </div>
                    <span class="d-sm-none">
                      <v-icon size="x-large" color="#D0D5DD"
                        >mdi-chevron-right</v-icon
                      >
                    </span>
                  </div>

                  <div class="d-flex align-center order-first order-sm-last">
                    <div class="ex-category__card--icon">
                      <span class="stat-icon" :class="category.icon"></span>
                    </div>
                    <div class="d-flex align-center pl-1">
                      <span class="ex-category__card--subtitle">
                        {{ category.title }}
                      </span>
                      <span class="pl-1 d-none d-sm-block">
                        <v-icon size="x-large" color="#D0D5DD"
                          >mdi-chevron-right</v-icon
                        >
                      </span>
                    </div>
                  </div>
                </div>
              </nuxt-link>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import cieIcon from "~/assets/images/boards/CIE.svg";
import edexcelIcon from "~/assets/images/boards/Edexcel.svg";
import AQAIcon from "~/assets/images/boards/AQA.svg";
import OCRIcon from "~/assets/images/boards/OCR.svg";
import GamaIcon from "~/assets/images/boards/Gama.svg";
import ScientificIcon from "~/assets/images/boards/Scientific Competition.svg";

const props = defineProps({
  stats: {},
});

const categories = ref([
  {
    key: "files",
    stat: "220",
    title: "Multimedia",
    icon: "icon-multimedia",
  },
  {
    key: "exams",
    stat: "410",
    title: "QuizHub",
    icon: "icon-exam",
  },
  {
    key: "tests",
    stat: "34,519",
    title: "Past Paper",
    icon: "icon-paper",
  },
  {
    key: "questions",
    stat: "+1,000",
    title: "Forum",
    icon: "icon-q-a",
  },
  {
    key: "tutorial",
    stat: "50",
    title: "Tutorial",
    icon: "icon-tutorial",
  },
]);
const selectLoader = ref(true);
const boardList = ref([]);
const gradeList = ref([]);
const gradeLoader = ref(false);
const selectedBoard = ref(null);
const selectedGrade = ref(null);
const boardImgs = ref([
  cieIcon,
  edexcelIcon,
  AQAIcon,
  OCRIcon,
  GamaIcon,
  ScientificIcon,
]);

const fetchInitialData = async () => {
  let params = { type: "section" };
  const response = await $fetch(`/api/v1/types/list`, { params });
  boardList.value = response.data.map((item, index) => ({
    ...item,
    img: boardImgs.value[index % boardImgs.value.length],
  }));
  selectedBoard.value = boardList.value[0];
  fetchGradeList();
};
const fetchGradeList = async () => {
  try {
    gradeLoader.value = true;
    let params = { type: "base" };
    params.section_id = selectedBoard.value.id;
    const response = await $fetch(`/api/v1/types/list`, { params });
    gradeList.value = response.data;
    selectedGrade.value = response.data[0].id;
  } catch (error) {
  } finally {
    gradeLoader.value = false;
  }
};
const fetchCategoryCounts = async () => {
  try {
    const params = new URLSearchParams();
    params.append("type", "test");
    params.append("page", "1");
    params.append("section", selectedBoard.value.id);
    params.append("base", selectedGrade.value.id);
    const requestUrl = `/api/v1/search?${params.toString()}`;
    const response = await $fetch(requestUrl);
    console.log("response.data.types_stats", response.data.types_stats);
    if (
      response &&
      response.status === 1 &&
      response.data &&
      response.data.types_stats
    ) {
      categories.value.find((cat, i) => cat.key == "tests").stat =
        parseInt(response.data.types_stats.test) || 0;

      categories.value.find((cat, i) => cat.key == "files").stat =
        parseInt(response.data.types_stats.learnfiles) || 0;

      categories.value.find((cat, i) => cat.key == "exams").stat =
        parseInt(response.data.types_stats.azmoon) || 0;

      categories.value.find((cat, i) => cat.key == "questions").stat =
        parseInt(response.data.types_stats.question) || 0;

      categories.value.find((cat, i) => cat.key == "tutorial").stat =
        parseInt(response.data.types_stats.tutorial) || 0;
    }
  } catch (error) {}
};

watch(
  () => selectedGrade.value,
  (val) => {
    console.log("val", val);
    fetchCategoryCounts();
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  fetchInitialData();
  console.log("stats", props.stats);
});
</script>

<style scoped>
.stat-icon {
  font-size: 2.3rem;
}
.icon-multimedia {
  color: #02b719;
}
.icon-paper {
  color: #2e90fa;
}
.icon-exam {
  color: #7c4dff;
}
.icon-q-a {
  color: #fdb022;
}
.icon-tutorial {
  color: #2e90fa;
}
.ex-category__card--title {
  color: #344054;
  font-size: 20px;
  font-weight: 700;
}
.ex-category__card--subtitle {
  color: #667085;
  font-size: 16px;
  font-weight: 500;
}
.ex-category__card {
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1),
    rgba(249, 250, 251, 1)
  );
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(242, 244, 247, 1);
  padding: 2rem 1.5rem;
  border-radius: 24px;
}
.ex-select-board-label {
  display: inline-flex;
  align-items: center;
  letter-spacing: inherit;
  line-height: inherit;
  max-width: 100%;
}
.ex-select-board-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ex-selector {
  display: flex;
  align-items: center;
  background: #4c4aff;
  max-width: 556px;
  justify-content: flex-start;
  margin: 0 auto;
  padding: 1rem 0.5rem;
  border-radius: 16px;
}
.ex-board-select {
  width: 120px;
  min-width: 130px;
  position: relative;
}
.ex-board-select::after {
  content: "";
  width: 1px;
  height: 32px;
  background-color: #9ea5d1;
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translate(-50%, -50%);
}
.ex-grade-select {
  padding-left: 10px;
  max-width: 450px;
  flex-grow: 1;
}

@media (min-width: 600px) {
  .ex-category__card {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 1),
      rgba(249, 250, 251, 1)
    );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(242, 244, 247, 1);
    padding: 3rem 1rem;
    border-radius: 24px;
  }
  .ex-board-select {
    width: 200px;
    position: relative;
  }
  .ex-board-select::after {
    content: "";
    width: 1px;
    height: 32px;
    background-color: #9ea5d1;
    position: absolute;
    right: -15px;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .ex-grade-select {
    padding-left: 30px;
    width: 450px;
  }
}
@media (min-width: 960px) {
  .ex-category__card--title {
    font-size: 30px;
    font-weight: 700;
  }
  .ex-category__card--subtitle {
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
