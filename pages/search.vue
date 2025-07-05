<template>
  <v-container class="flex-column margin-top-handle">
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-text-field
          label="Search anything...."
          variant="outlined"
          color="#FFB600"
          max-width="330"
          density="compact"
          class="custom-search-text-field"
        >
          <template v-slot:append>
            <v-btn
              icon
              varient="text"
              color="#FFB600"
              width="50"
              class="rounded-ts rounded-te-xl rounded-be-xl rounded-bs h-100 ml-n2"
              flat
            >
              <v-icon size="x-large" icon="mdi-magnify" color="#000000" />
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <search-filter-option />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup></script>

<style scoped>
.margin-top-handle {
  margin-top: 64px;
  min-height: calc(100vh - 64px);
}

:deep(.custom-search-text-field .v-field__outline__start) {
  border-radius: 24px 0 0 24px !important;
  flex: 0 0 30px !important;
}
:deep(.custom-search-text-field .v-field__outline__end) {
  border-radius: 0 4px 4px 0 !important;
}

@media (min-width: 960px) {
  .margin-top-handle {
    margin-top: 6.4rem;
    min-height: calc(100vh - 6.4rem);
  }
}
</style>
