<template>
  <div class="d-flex align-center justify-space-between header">
    <h1
      v-show="!editMode.title"
      class="gama-text-h6"
    >
      {{ title }}
      <v-btn
        v-if="isOwner"
        fab
        depressed
        x-small
        @click="editMode.title = true"
      >
        <v-icon> mdi-pencil </v-icon>
      </v-btn>
    </h1>
  </div>
  <div class="w-100">
    <v-textarea
      v-if="editMode.title"
      v-model="titleModel"
      placeholder="Title"
      rows="3"
    >
      <template #append-outer>
        <v-btn
          color="success"
          fab
          depressed
          :loading="editMode.title_loading"
          x-small
          @click="updateDetails"
        >
          <v-icon> mdi-check </v-icon>
        </v-btn>
      </template>
    </v-textarea>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})

const editMode = ref({
  title: false,
  title_loading: false,
})
const titleModel = ref(props.title)
const isOwner = ref(false)

const urlencodeFormData = (fd) => {
  let s = ''

  for (const pair of fd.entries()) {
    if (typeof pair[1] == 'string') {
      s += (s ? '&' : '') + encode(pair[0]) + '=' + encode(pair[1])
    }
  }
  return s
}

const encode = (s) => {
  return encodeURIComponent(s).replace(/%20/g, '+')
}

const updateDetails = () => {
  editMode.value.title_loading = true
  const formData = new FormData()
  formData.append('title', titleModel.value)

  useApiService
    .put(`/api/v1/tests/${route.params.slug[0]}`, urlencodeFormData(formData), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((response) => {
      if (response.data.id == 0 && response.data.repeated) {
        $toast.info('The paper is duplicated')
        emits('update-error', 'The paper is duplicated')
      }
      else {
        $toast.success('Updated successfully')
      }
    })
    .catch((err) => {
      if (err.response.status == 403) {
        emits('update-error', 'Authentication required')
      }
      else if (err.response.status == 400) {
        $toast.error(err.response.data.message)
        emits('update-error', err.response.data.message)
      }
    })
    .finally(() => {
      editMode.value.title = false
      editMode.value.title_loading = false
    })
}
</script>

<style scoped>

</style>
