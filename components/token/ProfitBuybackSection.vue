<template>
  <section class="profit-buyback-section">
    <v-container class="profit-buyback-container">
      <v-row justify="center">
        <v-col cols="12">
          <h2 class="profit-buyback-title">Profit Distribution and Buyback</h2>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" class="d-flex justify-center px-0">
          <div class="video-card px-4 px-sm-15 px-lg-0">
            <iframe
              class="rounded youtube-container"
              src="https://www.youtube.com/embed/qJcZwPcXyXU?si=Y4PcVrImzRAanotw"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            />
          </div>
        </v-col>
      </v-row>
      <v-row>
        <div class="profit-buyback-text px-7 px-sm-15 px-lg-0">
          <div class="profit-buyback-section">
            <p>
              After covering platform costs (servers, development, maintenance,
              content team, and taxes), all remaining profits go toward buying
              back $GET tokens.
            </p>
            <p class="pt-4">
              These bought-back tokens are redistributed to governance members
              based on their activity, contributions, and commitment to the
              ecosystem.
            </p>
          </div>
        </div>
      </v-row>
    </v-container>
  </section>
</template>

<script setup></script>

<style scoped>
  .profit-buyback-section {
  max-width: 1800px;         
  margin: 2rem auto 0 auto; 
  font-size: 1.15rem;       
  color: #000000;              
  text-align: center;       
  line-height: 1.6;
  padding-left: 1rem;
  padding-right: 1rem;
}
.profit-buyback-container {
  padding-top: 4rem;
  padding-bottom: 4rem;
}
.profit-buyback-title {
  text-align: center;
  color: #354053;
  margin-bottom: 7px;
  font-size: 24px;
  font-weight: 800;
}
.video-card {
  position: relative;
  width: 100%;
  height: auto;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  max-height: 550px;
  border-radius: 8px;
  overflow: hidden;
}
.youtube-container {
  width: 100%;
  height: 100%;
}

.youtube-btn {
  display: inline-block;
  background: #222;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  padding: 6px 18px;
  text-decoration: none;
  margin-top: 2px;
  pointer-events: auto;
  transition: background 0.2s;
}
.profit-buyback-text {
  max-width: 1000px;         
  margin: 2.5rem auto 2.5rem auto; 
  font-size: 1.35rem;       
  font-weight: 500;         
  color: #000000;
  text-align: center;
  line-height: 1.8;          
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
@media (min-width: 600px) {
  .profit-buyback-title {
    font-size: 30px;
    margin-bottom: 22px;
  }
  .video-card {
    height: 340px;
  }
  .profit-buyback-text {
    color: #000000;
    font-size: 24px;
    font-weight: 400;
    margin-top: 12px;
  }
}
@media (min-width: 960px) {
  .video-card {
    min-height: 400px;
    height: 540px;
  }
}

@media (max-width: 600px) {
  .profit-buyback-section {
    font-size: 1rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .profit-buyback-text {
    font-size: 1.1rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    margin: 1.5rem 0;
  }
}
</style>
