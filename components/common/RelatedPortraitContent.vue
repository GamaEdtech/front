<template>
    <div class="mx-4">
        <div class="d-flex mb-3" style="gap: 8px;">
            <div class="d-flex justify-center align-center rounded-circle" style="background-color: #2E90FA; width: 20px; height: 20px;">
                <span class="icon icon-paper white--text gtext-t5"></span>
            </div>
            
            <h1 class="gtext-t5 font-weight-semibold" style="color: #344054;">Related {{ pageName }} </h1>
        </div>
        <v-slide-group show-arrows class="related-content" :style="{height: `${CardHeight}`}">
            <v-slide-item
                v-for="item in data"
                :key="item.id"
            >
                <nuxt-link :to="`/${pageName}/${item.id}/${item.title_url}`">
                    <common-related-portrait-content-card :cardPicture="item.thumb_pic || fallbackImage" :cardTitle="item.title" :score="item.referee_score || item.type_title" :showScoreLabel="!!item.referee_score" />
                </nuxt-link>
            </v-slide-item>
        </v-slide-group>
    </div>
</template>
<script>

export default {
    data(){
        return {
            data:null,
            id : this.$route.params.id,
            fallbackImage: require('@/assets/images/GamaBag.webp')
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
                    const arrays = response.data
                    for (const key in arrays) {
                        if (Array.isArray(arrays[key]) && arrays[key].length > 0) {
                            this.data = arrays[key]; // Assign the first non-empty array
                            break;
                        }
                    }

                    // Optional: handle case where all arrays are empty
                    if (!this.data) {
                    this.data = []; // or null
                    }
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
    },
    computed: {
        CardHeight() {
            if (this.pageName === 'paper') {
                return '243px' ;
            } else if (this.pageName === 'multimedia') {
                return '120px';
            } 
            }
  }
}

</script>
<style>

.related-content {
  display: flex !important;
  flex-direction: column !important;
  align-items: center; 
}
.related-content:hover > .v-slide-group__prev,
.related-content:hover > .v-slide-group__next {
    opacity: 1;
    visibility: visible;
}

.related-content > .v-slide-group__wrapper {
  order: 1;
  width: 100%;
  align-items: center;
}

.related-content > .v-slide-group__prev,
.related-content > .v-slide-group__next {
  order: 2;
  margin-top: 12px;
  background-color: #344054CC;
  border-radius: 50%;
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  border: 1px solid #E4E7EC;
  color: white;
  opacity: 0;
  visibility: hidden;
  transition: opacity 300ms ease, visibility 300ms ease;
}
.related-content > .v-slide-group__prev > i,
.related-content > .v-slide-group__next > i{
    color:white !important;
}

.related-content > .v-slide-group__prev > .theme--light.v-icon.v-icon.v-icon--disabled ,
.related-content > .v-slide-group__next > .theme--light.v-icon.v-icon.v-icon--disabled {
    color:rgba(255, 255, 255, 0.544) !important;
}

.related-content > .v-slide-group__prev > .v-slide-group__prev--disabled, .v-slide-group__prev--disabled,
.related-content > .v-slide-group__next > .v-slide-group__next--disabled, .v-slide-group__next--disabled {
    pointer-events: unset !important;
}

.related-content > .v-slide-group__prev {
    position: absolute;
    margin-top: 90px;
    left: 15px;
    z-index: 10;
}
.related-content > .v-slide-group__next {
    position: absolute;
    margin-top: 90px;
    right: 15px;
    z-index: 10;
}
</style>