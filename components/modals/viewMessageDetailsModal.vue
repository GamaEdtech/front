<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title class="gtext-t4 grey lighten-2">
          {{ email }}
        </v-card-title>

        <v-card-text class="mt-4">
          <span class="gtext-t5"> {{ message }} </span>
          
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="$emit('update:dialog', false)">
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    message: String,
    email: String
  }
}
</script>