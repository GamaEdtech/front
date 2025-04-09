<template>
  <div class="breadcrumbs-container">
    <v-breadcrumbs :items="breads" >
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right" />
      </template>
    </v-breadcrumbs>
  </div>
</template>
<script setup>
defineProps({
  breads: Array
})
</script>


<style>
.breadcrumbs-container{
  background: #F5F5F5!important;
  border-radius: 8px;
}
</style>
