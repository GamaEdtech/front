<template>
  <section class="trust-community-section">
    <v-container class="trust-community-container">
      <div class="trust-community-title text-h3">
        Built On Trust, Driven By Community
      </div>
      <div class="trust-community-subtitle text-h5">
        At Gamatrain, our mission is to empower the community through a
        foundation of:
      </div>
      <v-row
        class="trust-community-content"
        justify="center"
        align="center"
        no-gutters
      >
        <v-col cols="12" md="4" class="trust-community-list-col">
          <div class="trust-community-list">
            <div
              class="trust-community-list-item"
              v-for="item in items"
              :key="item.text"
            >
              <span class="trust-community-icon">
                <v-img
                  :src="item.img"
                  alt="icon"
                  class="trust-community-img-icon"
                  contain
                  width="21"
                  height="18"
                />
              </span>
              <span class="trust-community-list-text">{{ item.text }}</span>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="4" class="trust-community-illustration-col">
          <v-img
            src="/images/token/built.png"
            alt="Community Illustration"
            class="trust-community-illustration d-none d-lg-block"
            contain
            width="245"
            height="245"
          />
        </v-col>
      </v-row>
      <div class="trust-community-description text-h5">
        Every decision, reward, and improvement is made with our contributors in
        mind – because GamaTrain is built with you, not just for you.
      </div>
    </v-container>
  </section>
</template>

<script>
export default {
  name: "TrustCommunitySection",
  data() {
    return {
      items: [
        {
          img: "/images/token/trust.png",
          text: "Trust",
        },
        {
          img: "/images/token/transparency.png",
          text: "Transparency",
        },
        {
          img: "/images/token/shared.png",
          text: "Shared Accountability",
        },
      ],
    };
  },
};
</script>

<style scoped>
.trust-community-section {
  background: #fff;
  padding: 56px 0 40px 0;
}
.trust-community-container {
}
.trust-community-title {
  text-align: center;
  color: #354053;
  font-weight: 800;
  margin-bottom: 32px;
}
.trust-community-subtitle {
  text-align: center;
  color: #24292f;
  margin-bottom: 32px;
}
.trust-community-content {
  margin-bottom: 32px;
}
.trust-community-list-col {
  display: flex;
  justify-content: center;
}
.trust-community-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.trust-community-list-item {
  display: flex;
  align-items: center;
  gap: 11px;
}
.trust-community-icon {
  background: #23272f;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #23272f;
}
.trust-community-img-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
.trust-community-list-text {
  color: #4a5568;
  font-size: 16px;
  font-weight: 700;
  font-family: "Inter", "Roboto", "Arial", sans-serif;
}
.trust-community-illustration-col {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.trust-community-illustration {
  width: 200px;
  height: 200px;
  margin: 0 auto;
}
.trust-community-description {
  margin-top: 40px;
  text-align: center;
  color: #4a5568;
  margin-left: auto;
  margin-right: auto;
}
@media (max-width: 960px) {
  .trust-community-list-col,
  .trust-community-illustration-col {
    justify-content: center !important;
    text-align: center;
  }
  .trust-community-list {
    margin-left: 0;
    margin-right: 0;
  }
  .trust-community-illustration {
    margin-top: 32px;
    margin-bottom: 16px;
  }
}
</style>
