<template>
  <section class="earn-get-section">
    <v-container class="earn-get-container">
      <div class="earn-get-title">How Do You Earn $GET?</div>
      <v-row class="earn-get-grid" align="center" justify="center" no-gutters>
        <v-col v-for="(card, i) in cards" :key="i" cols="12" sm="6" md="3">
          <div class="earn-get-card">
            <div class="earn-get-img-section">
              <v-img :src="card.img" class="earn-get-img" contain />
            </div>
            <div class="earn-get-card-content">
              <div class="earn-get-card-title">{{ card.title }}</div>
              <div class="earn-get-card-desc">{{ card.desc }}</div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
export default {
  name: "EarnGetSection",
  data() {
    return {
      cards: [
        {
          title: "Teachers",
          desc: "Create content and upload learning materials",
          img: "/images/token/teachers.png",
        },
        {
          title: "Students",
          desc: "Use the system and submit assignments",
          img: "/images/token/students.png",
        },
        {
          title: "Developers",
          desc: "Contribute to the development process",
          img: "/images/token/developers.png",
        },
        {
          title: "Community",
          desc: "Use social media to help others learn about Gamatrain",
          img: "/images/token/community.png",
        },
      ],
    };
  },
};
</script>

<style scoped>
.earn-get-section {
  background: rgba(36, 41, 47, 0.05);
  padding: 48px 0;
  margin-top: 4rem;
}
.earn-get-container {
  max-width: 1100px;
  margin: 0 auto;
}
.earn-get-title {
  color: #000000;
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 40px;
  text-align: center;
}
.earn-get-grid {
}
.earn-get-card {
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 0 4px 24px 0 rgba(44, 62, 80, 0.08);
  margin: 10px;
  padding: 0;
  overflow: hidden;
}
.earn-get-img-section {
  background: rgba(36, 41, 47, 0.7);
  width: 100%;
  height: 194px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.earn-get-img {
  max-width: 70%;
  height: 100%;
  max-height: 90%;
  background: transparent;
}
.earn-get-card-content {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 12px 22px 28px 22px;
}
.earn-get-card-title {
  color: #222;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}
.earn-get-card-desc {
  color: #6e7781;
  font-size: 14px;
}
@media (max-width: 1260px) {
  .earn-get-card {
  }
  .earn-get-img-section {
    height: 200px;
  }
  .earn-get-img {
    /* width: 120px;
    height: 120px; */
  }
}
@media (max-width: 960px) {
  .earn-get-card {
  }
  .earn-get-img-section {
    height: 100px;
  }
  .earn-get-img {
    width: 60px;
    height: 60px;
  }
}
@media (max-width: 600px) {
  .earn-get-container {
    padding: 0 8px;
  }
  .earn-get-title {
    font-size: 20px;
    margin-bottom: 24px;
  }
  .earn-get-card {
    width: 100%;
  }
  .earn-get-img-section {
    height: 60px;
  }
  .earn-get-img {
    width: 40px;
    height: 40px;
  }
  .earn-get-card-content {
    padding: 10px 6px 0 6px;
  }
}
</style>
