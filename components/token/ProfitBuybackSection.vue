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
        <div class="profit-buyback-description px-7 px-sm-15 px-lg-0">
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
      </v-row>
    </v-container>
  </section>
</template>

<script setup></script>

<style scoped>
.profit-buyback-section {
  background: #fff;
  padding: 24px 0;
}
.profit-buyback-container {
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
  height: 200px;
  max-width: 100%;
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
.profit-buyback-description {
  color: #242a2f;
  font-size: 16px;
  font-weight: 600;
  margin-top: 32px;
}
@media (min-width: 600px) {
  .profit-buyback-title {
    font-size: 30px;
    margin-bottom: 22px;
  }
  .video-card {
    height: 340px;
  }
  .profit-buyback-description {
    color: #6e7781;
    font-size: 18px;
    font-weight: 400;
    margin-top: 32px;
  }
}
@media (min-width: 960px) {
  .video-card {
    min-height: 400px;
    height: 540px;
  }
}
</style>
