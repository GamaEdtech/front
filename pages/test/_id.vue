<template>
  <div class="pt-16 pt-md-14 pt-lg-4">
    <test-details :contentData="contentData" />
  </div>
</template>

<script>
import TestDetails from "~/components/TestDetails.vue";
export default {
  auth: false,
  head() {
    const stripHtml = (html) => {
      return html ? html.replace(/<[^>]+>/g, "") : "";
    };
    const cleanSubject = (name) => {
      return name.replace(/\s*\(.*?\)/, "");
    };
    return {
      titleTemplate: "%s Gamatrain",
      title: `${stripHtml(this.contentData.question)?.substring(
        0,
        100
      )} | ${cleanSubject(this.contentData.lesson_title)} Quiz`,

      meta: [
        {
          hid: "apple-mobile-web-app-title",
          name: "apple-mobile-web-app-title",
          content: `${stripHtml(this.contentData.question)?.substring(
            0,
            100
          )} | ${cleanSubject(this.contentData.lesson_title)} Quiz`,
        },
        {
          hid: "og:title",
          name: "og:title",
          content: `${stripHtml(this.contentData.question)?.substring(
            0,
            100
          )} | ${cleanSubject(this.contentData.lesson_title)} Quiz`,
        },
        {
          hid: "og:site_name",
          name: "og:site_name",
          content: "GamaTrain",
        },
        {
          hid: "description",
          name: "description",
          content: stripHtml(this.contentData.question),
        },
        {
          hid: "og:description",
          name: "og:description",
          content: stripHtml(this.contentData.question),
        },
      ],
    };
  },
  async asyncData({ params, $axios, error }) {
    try {
      const content = await $axios.$get(`/api/v1/examTests/${params.id}`, {
        params: {
          full: true,
        },
      });
      var contentData = [];

      //Check data exist
      if (content.status === 1) {
        contentData = content.data;
      }

      return { contentData };
    } catch (e) {
      if (e.response && e.response.status === 404) {
        // Redirect using the error function
        error({ statusCode: 404, message: "Page not found" });
      }
    }
  },
  comments: {
    TestDetails,
  },
};
</script>
