<template>
  <div>
    <template v-if="loader">
      <v-row>
        <v-col cols="12" md="12">
          <v-skeleton-loader height="200"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" md="12">
          <v-skeleton-loader height="200"></v-skeleton-loader>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <!--Profile section-->
      <v-row>
        <v-col cols="12" class="px-0 px-md-2">
          <v-card :flat="display.xs.value">
            <v-card-text class="px-8 px-sm-8 pa-md-3">
              <v-row>
                <!--General info-->
                <v-col cols="12">
                  <dashboard-general-info-dashboard
                    ref="generalInfoRef"
                    :user-data="userInfo?.user || {}"
                    :progress-data="userInfo?.profileCompletion || {}"
                  />
                </v-col>
                <!--End general info-->

                <!--Statistics section-->
                <v-col cols="12" class="px-0 px-md-4">
                  <dashboard-statistics :user-info="userInfo" />
                </v-col>
                <!--End Statistics section-->
              </v-row>

              <!--Content type-->
              <dashboard-create-content-button
                ref="createContentRef"
                :statistics="userInfo?.stats || {}"
              />
              <!--End content type-->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!--End profile section-->

      <!--Exams section-->
      <v-row v-if="userType === '6'">
        <v-col cols="12" class="px-0 px-sm-2">
          <v-card>
            <v-card-title class="text-h4">
              <v-row>
                <v-col cols="6">
                  <i class="fa-solid fa-laptop mr-2"></i>
                  Exams
                </v-col>
                <v-col cols="6" class="text-right">
                  <v-btn color="warning"> See result </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text class="px-sm-8 px-md-4">
              <v-alert type="warning">
                You have not participated in 10 out of 20 tests
              </v-alert>

              <v-row class="mt-5 d-flex d-md-none">
                <v-col cols="6">
                  <p class="text-h5">
                    <i class="fa-regular fa-circle-check green--text"></i>
                    Participated
                  </p>
                </v-col>
                <v-col cols="6">
                  <p class="text-h5">
                    <i class="fa-regular fa-times-circle red--text"></i>
                    Not Participated
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="px-0 px-sm-4 px-md-4">
                  <v-table class="exams_table">
                    <thead>
                      <tr>
                        <th class="text-left text-h5">Course name</th>
                        <th class="text-center teal--text text-h5">
                          <i
                            class="fa-regular fa-circle-check fa-xl green--text d-block d-md-none"
                          ></i>
                          <span class="d-none d-md-block"> Participated </span>
                        </th>
                        <th class="text-center orange--text text-h5">
                          <i
                            class="fa-regular fa-times-circle fa-xl red--text d-block d-md-none"
                          ></i>
                          <span class="d-none d-md-block">
                            Not Participated
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="item in userInfo?.examSuggestions?.lessons || []"
                        :key="item.id"
                      >
                        <td>{{ item.title }}</td>
                        <td class="text-center">{{ item.participated }}</td>
                        <td class="text-center">
                          {{ item.total - item.participated }}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr bgcolor="#E5FBF7">
                        <td>Total</td>
                        <td class="text-center">
                          {{ userInfo?.examSuggestions?.participated || "" }}
                        </td>
                        <td class="text-center">
                          {{ userInfo?.examSuggestions?.total || "" }}
                        </td>
                      </tr>
                    </tfoot>
                  </v-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!--End exam section-->
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useDisplay } from "vuetify";
const { $toast } = useNuxtApp();

definePageMeta({
  layout: "dashboard-layout",
  middleware: ["auth"],
});

useHead({
  title: "Dashboard",
});

const { user } = useUser();
const generalInfoRef = ref(null);
const createContentRef = ref(null);
const loader = ref(true);
const userInfo = ref({});
const userType = computed(() => user.value?.group_id);
const display = useDisplay();
const getUserInfo = async () => {
  try {
    loader.value = true;
    const apiUrl =
      userType.value === "5"
        ? "/api/v1/teachers/dashboard"
        : "/api/v1/students/dashboard";

    const data = await $fetch(apiUrl);

    if (data.data) {
      userInfo.value = data.data;
    }
    loader.value = false;
  } catch (error) {
    if (error.response?.status === 403) {
      useAuth().logout();
    }
    $toast.error(error.response.data.message);
  }
};

onMounted(() => {
  getUserInfo();
});
</script>

<style scoped>
.teaching-request-details i {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.teaching-request-details span {
  font-size: 1.5rem;
}

.exams_table tbody tr td {
  font-size: 1.2rem !important;
}

.exams_table tfoot tr td {
  font-size: 1.2rem !important;
  font-weight: bolder;
}
</style>
