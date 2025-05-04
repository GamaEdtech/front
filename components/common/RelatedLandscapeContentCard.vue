<template>
    <v-card
      class="mx-1 relative overflow-hidden"
      height="107"
      width="160"
      style="border-radius: 8px !important;"
    >
      <v-img
        class="white--text align-end"
        height="107px"
        :src="cardPicture"
      >
      </v-img>
      <div class="circle-container">
            <div class="text-center">
                <p class="" style="font-size: 10px !important; text-wrap: nowrap; font-weight: 700 !important; color: white;">{{ score }}</p>
                <p class="" style="font-size:9px !important; text-wrap: nowrap; font-weight: 400 !important; color: white;line-height: 1;">score</p>
            </div>
      </div>
      
  
      <v-card-text class="text--primary relative z-10 bg-white bg-opacity-80">
        <div class="inner-curve">
            <div class="two-line-ellipsis">{{ cardTitle }}</div>
        </div>
      </v-card-text>
    
    </v-card>
</template>
<script>

export default{
    name: "related-portrait-content-card",
    data(){
        return{
            
        }
    },
    props:{
        cardPicture:{
            type:String
        },
        cardTitle:{
            type:String
        },
        score:{
            type:String
        }
    }
}
</script>
<style>

.inner-curve {
  --r: 8px;  /* control the rounded part */
  --s: 30px;  /* control the size of the cut */
  --a: 35deg; /* control the depth of the curvature */
  --p: 50%;   /* control the position */
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 52px;
  padding: 8px;
  padding-top: 16px;
  aspect-ratio: 3/2;
  background: #344054CC;
  border: 1px solid #E4E7EC;
  border-radius: var(--r);
  --_m:var(--r),#000 calc(100% - 1px),#0000;
  --_d:(var(--s) + var(--r))*cos(var(--a));
  mask:
    radial-gradient(var(--r) at calc(var(--p) + var(--_d)) var(--_m)),
    radial-gradient(var(--r) at calc(var(--p) - var(--_d)) var(--_m)),
    radial-gradient(var(--s) at var(--p) calc(-1*sin(var(--a))*var(--s)),
      #0000 100%,#000 calc(100% + 1px)) 0 calc(var(--r)*(1 - sin(var(--a)))) no-repeat,
    linear-gradient(90deg,#000 calc(var(--p) - var(--_d)),#0000 0 calc(var(--p) + var(--_d)),#000 0);
}
.circle-container{
border-radius: 50%;
border: 1px solid #E4E7EC;
background: #344054CC;
width: 32px;
height: 32px;
left: 63px;
z-index: 10;
position: relative;
bottom:70px
}
.two-line-ellipsis{
    font-size: 10px !important;
    font-weight: 500 !important;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    color: white;
    text-align: center;
}
</style>