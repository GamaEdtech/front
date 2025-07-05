<template>
  <section class="trust-community-section">
    <v-container class="trust-community-container">
      <h2 class="trust-community-title">Built On Trust, Driven By Community</h2>
      <p class="trust-community-subtitle text-h4">
        At Gamatrain, our mission is to empower the community through a
        foundation of:
      </p>
      <v-row
        class="trust-community-content"
        justify="center"
        align="center"
        no-gutters
      >
        <v-col cols="12" md="4" class="trust-community-list-col">
          <ul class="trust-community-list">
            <li
              class="trust-community-list-item"
              v-for="item in items"
              :key="item.text"
            >
              <span class="trust-community-icon">
                <img
                  :src="item.img"
                  :alt="item.text + ' icon'"
                  class="trust-community-img-icon"
                />
              </span>
              <span class="trust-community-list-text">{{ item.text }}</span>
            </li>
          </ul>
        </v-col>
        <v-col cols="12" md="4" class="trust-community-illustration-col">
          <img
            src="/images/token/community.svg"
            alt="Community trust and collaboration illustration"
            class="trust-community-illustration"
          />
        </v-col>
      </v-row>
      <p class="trust-community-description text-h4">
        Every decision, reward, and improvement is made with our contributors in
        mind – because GamaTrain is built with you, not just for you.
      </p>
    </v-container>
  </section>
</template>

<script setup>
const items = ref([
  {
    img: "/images/token/Trust.svg",
    text: "Trust",
  },
  {
    img: "/images/token/shared.svg",
    text: "Shared Accountability",
  },
  {
    img: "/images/token/transparency.svg",
    text: "Transparency",
  },
]);
</script>

<style scoped>
.trust-community-section {
  background: #fff;
  padding: 56px 4rem 40px 4rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
.trust-community-container {
}
.trust-community-title {
  text-align: center;
  color: #354053;
  font-weight: 800;
  margin-bottom: 32px;
  font-size: 24px;
}
.trust-community-subtitle {
  text-align: center;
  color: #6c757d;
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
  list-style: none;
  padding: 0;
  margin: 0;
}
.trust-community-list-item {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}
.trust-community-icon {
  background: #333333 !important;
  border: 1px solid #2a2a2a;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.trust-community-img-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: none;
  opacity: 1;
}
.trust-community-list-item:hover .trust-community-icon {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #2a2a2a !important;
  border-color: #222222;
}
.trust-community-list-item:hover .trust-community-img-icon {
  opacity: 1;
}
.trust-community-list-text {
  color: #2d3748;
  font-size: 20px;
  font-weight: 600;
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
  color: #6c757d;
  margin-left: auto;
  margin-right: auto;
}
@media (min-width: 600px) {
  .trust-community-title {
    text-align: center;
    color: #354053;
    font-weight: 800;
    margin-bottom: 32px;
    font-size: 30px;
  }
  .trust-community-illustration {
    width: 245px;
    height: 245px;
  }
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
    width: 180px;
    height: 180px;
  }
}
@media (max-width: 600px) {
  .trust-community-title {
    font-size: 18px;
  }
  .trust-community-icon {
    width: 40px;
    height: 40px;
    margin-right: 16px;
  }
  .trust-community-img-icon {
    width: 20px;
    height: 20px;
  }
  .trust-community-list-text {
    font-size: 16px;
  }
  .trust-community-description,
  .trust-community-subtitle {
    font-size: 14px;
  }
  .trust-community-section {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
  .trust-community-illustration {
    width: 160px;
    height: 160px;
  }
  .trust-community-list-item .trust-community-icon {
    background: #333333 !important;
  }
}
.profit-buyback-section {
  max-width: 900px;
  margin: 2rem auto 0 auto;
  font-size: 1.15rem;
  color: #555;
  text-align: center;
  line-height: 1.6;
  padding-left: 1rem;
  padding-right: 1rem;
}
@media (max-width: 600px) {
  .profit-buyback-section {
    font-size: 1rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
