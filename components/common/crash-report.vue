<!-- in refactor proccess -->
<template>
  <!--Crash report dialog-->
  <v-dialog v-model="dialog" max-width="800">
    <v-card title="Crash report">
      <!-- <v-card-title class="text-h5"> Crash report </v-card-title> -->
      <!-- <validation-observer ref="observer" v-slot="{ invalid }"> -->
      <form @submit.prevent="sendReport">
        <v-card-text>
          <!-- <validation-provider -->
          <!-- v-slot="{ errors }" name="report_type" rules="required" > -->
          <v-radio-group :error-messages="errors" v-model="form.report_type">
            <v-radio
              v-for="(type, index) in report_type_list"
              :key="index"
              :label="type.label"
              :value="type.value"
            ></v-radio>
          </v-radio-group>
          <!-- </validation-provider> -->

          <!-- <validation-provider -->
          <!-- v-slot="{ errors }" name="description" rules="required|min:25" > -->
          <v-textarea
            label="Description"
            :error-messages="errors"
            v-model="form.message"
            variant="outlined"
            hint="You must enter at least 25 characters"
            persistent-hint
          />
          <!-- </validation-provider> -->
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="dialog = false"> Discard </v-btn>

          <v-btn
            color="green darken-1"
            outlined
            :disabled="invalid"
            :loading="loading"
            type="submit"
          >
            Send
          </v-btn>
        </v-card-actions>
      </form>
      <!-- </validation-observer> -->
    </v-card>
  </v-dialog>
  <!--End crash report dialog-->
</template>

<script>
export default {
  name: "crash-report",
  props: {
    report_type_list: {
      type: Array,
      default: () => [
        {
          value: 1,
          label: "The file cannot be downloaded",
        },
        {
          value: 2,
          label: "The file is wrong",
        },
        {
          value: 3,
          label: "The content of the file is inappropriate or incorrect.",
        },
      ],
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
      form: {
        id: this.$route.params.id,
        type: "",
        report_type: "",
        message: "",
      },
    };
  },
  methods: {
    sendReport() {
      this.loading = true;
      //Arrange to form data
      let formData = new FormData();
      for (let key in this.form) {
        formData.append(key, this.form[key]);
      }

      $fetch("/api/v1/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: this.urlencodeFormData(formData), // Move formData inside options
      })
        .then((response) => {
          this.$toast.success("Report sent successfully");
        })
        .catch((err) => {
          if (err.response.status == 403)
            this.$router.push({ query: { auth_form: "login" } });
          else if (err.response.status == 400)
            this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.loading = false;
          this.dialog = false;
        });
    },

    //Convert form data from multipart to urlencode
    urlencodeFormData(fd) {
      var s = "";

      for (var pair of fd.entries()) {
        if (typeof pair[1] == "string") {
          s +=
            (s ? "&" : "") + this.encode(pair[0]) + "=" + this.encode(pair[1]);
        }
      }
      return s;
    },
    encode(s) {
      return encodeURIComponent(s).replace(/%20/g, "+");
    },
    //End convert form data from multipart to urlencode
  },
};
</script>

<style scoped></style>
