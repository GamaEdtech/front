<template>
  <section class="token-purchase-bg">
    <div class="token-purchase-container">
      <div class="token-purchase-content">
        <h2 class="main-heading">Join the Movement</h2>
        <h3 class="sub-heading">
          Buy <span class="head-yellow">$GET</span> Today
        </h3>
        <p class="token-purchase__description">
          Empower education. Power the Gama ecosystem.
        </p>
        <div class="d-flex justify-center align-center flex-column mt-8">
          <div class="token-purchase__title">Buy now on</div>
          <a
            target="_blank"
            href="https://jup.ag/swap/So11111111111111111111111111111111111111112-GeutGuhcTYRf4rkbZmWDMEgjt5jHyJN4nHko38GJjQhv"
            rel="noopener noreferrer"
            class="token-purchase__btn"
          >
            <img
              src="/images/token/jupiter.png"
              alt="Jupiter exchange logo"
              class="jupiter-logo"
            />
            <div class="pl-3">Jupiter</div>
          </a>
        </div>
      </div>
      <figure class="token-purchase-figure">
        <img
          src="/images/token/GET_CTA_Desktop.svg"
          alt="People holding Gama tokens illustration"
          class="illustration-desktop"
        />
        <img
          src="/images/token/GET_CTA_IPAD_Mini_8.3.svg"
          alt="People holding Gama tokens illustration for iPad Mini"
          class="illustration-ipadmini"
        />
        <img
          src="/images/token/GET_CTA_Android_Small.svg"
          alt="People holding Gama tokens illustration for Android Small"
          class="illustration-androidsmall"
        />
      </figure>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.token-purchase-bg {
  background: linear-gradient(to bottom, #999999, #f2f2f2);
  width: 100%;
  position: relative;
  overflow: hidden;
  max-height: 100vh;
}
.token-purchase-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  overflow-x: hidden;
}
.token-purchase-content {
  z-index: 2;
  width: 100%;
  text-align: center;
}


.token-purchase-figure {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 0;
  padding: 0;
}
.illustration-desktop,
.illustration-ipadmini,
.illustration-androidsmall {
  display: none;
  width: 100%;
  height: auto;
  object-fit: contain;
  margin: 0 auto;
}
.main-heading {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  padding-top: 10rem;
}
.sub-heading {
  font-size: 40px;
  font-weight: 700;
  color: #000000;
  text-align: center;
}
.sub-heading .head-yellow {
  color: #fecd1c;
}
.token-purchase__description {
  color: #000000;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}
.token-purchase__btn {
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 160px;
  border-radius: 6px;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
}
.token-purchase__btn img {
  width: 27px;
  height: 27px;
}
.token-purchase__title {
  color: #000000;
  font-size: 24px;
  font-weight: 700;
  padding-bottom: 1rem;
}
@media (min-width: 600px) {
  .token-purchase-bg {
    padding-bottom: 30rem;
  }
  .token-purchase__title {
    color: #313231;
    font-size: 24px;
    font-weight: 500;
  }
  .token-purchase__description {
    font-size: 24px;
  }
  .main-heading {
    font-size: 56px;
    font-weight: 700;
  }
  .sub-heading {
    font-size: 56px;
    font-weight: 700;
  }
}
@media (min-width: 960px) {
  .token-purchase-bg {
    padding-bottom: 40rem;
  }
  .token-purchase__title {
    color: #313231;
    font-size: 28px;
    font-weight: 700;
    padding-bottom: 1rem;
  }
  .main-heading {
    font-size: 84px;
    font-weight: 700;
  }
  .sub-heading {
    font-size: 96px;
    font-weight: 700;
    padding-bottom: 4rem;
  }
  .token-purchase__description {
    color: #24292f;
    font-size: 32px;
    font-weight: 400;
    text-align: center;
  }
  .token-purchase__btn {
    height: 68px;
    width: 215px;
    font-size: 32px;
    font-weight: 600;
  }
  .token-purchase__btn img {
    width: 40px;
    height: 40px;
  }
}
@media (min-width: 961px) {
  .illustration-desktop { display: block; max-width: 1000px; }
}
@media (min-width: 601px) and (max-width: 960px) {
  .illustration-ipadmini { display: block; max-width: 700px; }
}
@media (max-width: 600px) {
  .token-purchase-bg {
    min-height: 32vh;
    padding-top: 2rem;
    padding-bottom: 1.5rem;
  }
  .main-heading {
    padding-top: 2rem;
  }
  .token-purchase-figure {
    margin-top: 1rem;
  }
  .illustration-androidsmall {
    max-height: 120px;
  }
  .token-purchase-container {
    padding: 4rem 0.5rem 0 0.5rem;
  }
  .token-purchase__description {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    line-height: 1.6;
    padding: 0 0.5rem;
  }
}
</style>
