<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>Select account type</h2>
        <p>Please select user type</p>
        <v-divider class="my-2" />

        <v-radio-group v-model="user_type">
          <v-radio value="6" label="I'm student" />
          <v-radio value="5" label="I'm teacher" />
        </v-radio-group>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "select_user_type",
  data() {
    return {
      user_type: 2,
    };
  },
  watch: {
    user_type() {
      this.setUserType();
    },
  },
  mounted() {
    this.$router.push({ path: "/user" });
  },
  methods: {
    async setUserType() {
      const querystring = require("querystring");
      this.$axios
        .$post(
          "/api/v1/users/group",
          querystring.stringify({
            group: this.user_type,
          }),
          {
            headers: {
              Authorization: `${this.$auth.strategy.token.get()}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 1) {
            var updatedData = {
              avatar: this.$auth.user.avatar,
              credit: this.$auth.user.credit,
              email: this.$auth.user.email,
              first_name: this.$auth.user.first_name,
              group_id: this.user_type.toString(), //New user type
              last_name: this.$auth.user.last_name,
              phone: this.$auth.user.phone,
              sex: this.$auth.user.sex,
            };
            //Update current user data
            this.$auth.setUser(updatedData);
            this.$auth.user.group_id = this.user_type;

            this.$router.push({
              path: "/user",
            });
          }
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
  },
};
</script>

<style scoped></style>
