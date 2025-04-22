<template>
  <v-card flat class="content_main_info">
    <v-row class="align-center">
      <v-col cols="3">
        <v-img
          :src="contentData?.avatar"
          alt=""
          class="d-inline-block"
          cover
          height="48"
          width="48"
        />
      </v-col>
      <v-col cols="9" class="pl-0">
        <p class="creator_title">
          {{ contentData?.first_name }} {{ contentData?.last_name }}
        </p>
      </v-col>
    </v-row>
    <v-divider class="my-2" />
    <v-row>
      <v-col cols="12" class="pb-0">
        <i class="fa-solid fa-folder mr-1 icon"></i>
        Classification: {{ contentData?.test_type_title }}
      </v-col>
      <v-col cols="12" class="pb-0">
        <i class="fa-solid fa-book-open-reader mr-1 icon"></i>
        Page count: {{ contentData?.q_file_pages }}
      </v-col>
      <v-col cols="12" class="pb-0">
        <i class="fa-solid fa-eye mr-1 icon"></i>
        Viewed: {{ contentData?.views }}
      </v-col>
      <v-col cols="12" class="pb-0">
        <i class="fa-solid fa-calendar-alt mr-1 icon"></i>
        Last update: {{ $dayjs(contentData?.up_date).fromNow() }}
      </v-col>
      <v-col cols="12" class="pb-0">
        <div @click="openCrashReport" class="pointer">
          <i class="fa-solid fa-bug mr-1 icon"></i>
          Crash report
        </div>
      </v-col>
      <v-col cols="12" class="pb-0">
        <slot name="share-dialog"></slot>
      </v-col>
    </v-row>

    <div class="text-center mt-2">
      <v-rating
        v-model="rating"
        hover
        background-color="grey-darken-1"
        color="yellow-darken-3"
        size="35"
        half-increments
      ></v-rating>
    </div>
    <v-divider class="d-none d-md-block" />

    <v-row class="mt-1 d-none d-md-block">
      <v-col cols="12" class="pb-0">
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
            {{ contentData?.test_type_title }}
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
        <v-btn
          v-if="contentData?.exams && contentData?.exams[0]?.status != 7"
          :to="`/exam/${contentData?.exams[0].id}`"
          block
          color="#5600e8"
          class="mb-2 white--text font-weight-bold"
        >
          Begin Quiz
        </v-btn>
        <v-btn
          v-else
          :to="`/test-maker/create?board=${contentData?.section}&grade=${contentData?.base}&subject=${contentData?.lesson}&paperId=${contentData?.id}`"
          block
          outlined
          color="primary"
          class="mb-2 white--text font-weight-bold"
        >
          Create Quiz
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
const props = defineProps({
  contentData: {
    type: Object,
    required: true,
  },
});

const rating = ref(4.5);

const emits = defineEmits(["download", "crash-report"]);

const openCrashReport = () => {
  emits("crash-report");
};
</script>

<style scoped>
.content_main_info {
  padding: 27px !important;
  background: #f5f5f5 !important;
  border-radius: 6px;
}

.content_main_info .creator_title {
  font-size: 18px;
}

p {
  font-size: 1.3rem !important;
}
</style>
