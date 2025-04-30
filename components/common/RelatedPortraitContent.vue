<template>
    <div class="mx-4">
        <h1>Related {{ pageName }} </h1>
        <nuxt-link :to="`/${pageName}/${id}`">
            <v-slide-group>
                <v-slide-item
                    v-for="item in data"
                    :key="item.id"
                >
                    <common-related-portrait-content-card :cardPicture="item.thumb_pic" :cardTitle="item.title" :score="item.referee_score" />
                </v-slide-item>
            </v-slide-group>
        </nuxt-link>
    </div>
</template>
<script>

export default {
    data(){
        return {
            data:null,
            id : this.$route.params.id
        }
    },
    props:{
        pageName:{
            type:String
        },
        source:{
            type:String
        },
        request:{
            type:String
        }
    },
    methods:{
        getRelatedContent(){
            this.$axios.$get(`/api/v1/recommendations/related`,{ 
                params: {
                source: this.source,
                request: this.request,
                id: this.id,
                }})
                .then(response => {
                    this.data = response.data.tests
                })
                .catch(error => {
                    console.error('Search error:', error);
                })
                .finally(() => {
                    
                })
        }
    },
    mounted(){
        this.getRelatedContent();
    }
}

</script>
<style>
</style>