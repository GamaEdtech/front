<template>
  <section class="token-purchase-bg">
    <div class="token-purchase-container">
      <div class="token-purchase-content">
        <h2 class="main-heading">
          Join the Movement
        </h2>
        <h3 class="sub-heading">
          Buy <span class="head-yellow">$GET</span> Today
        </h3>
        <p class="token-purchase__description">
          Empower education. Power the Gama ecosystem.
        </p>
        <div class="d-flex justify-center align-center flex-column mt-8">
          <div class="token-purchase__title mb-1">
            Buy now on
          </div>
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
            >
            <div class="pl-3">Jupiter</div>
          </a>
        </div>
      </div>
      <figure>
        <img
          src="/images/token/tokens.png"
          alt="People holding Gama tokens illustration"
          class="token-purchase__illustration d-none d-md-block"
        >
        <img
          src="/images/token/tokens_tablet.png"
          alt="People holding Gama tokens illustration for tablet"
          class="token-purchase__illustration d-none d-sm-block d-md-none"
        >
        <img
          src="/images/token/tokens_mobile.png"
          alt="People holding Gama tokens illustration for mobile"
          class="token-purchase__illustration d-sm-none"
        >
      </figure>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.token-purchase-bg {
  background: linear-gradient(to bottom, #999999, #f2f2f2);
  position: relative;
  overflow: hidden;
  padding-bottom: 20rem;
}
.token-purchase-content {
  position: relative;
  z-index: 3;
}
.token-purchase__illustration {
  position: absolute;
  left: 10px;
  width: 90%;
  max-width: 100%;
  bottom: 20px;
  z-index: 1;
}
.token-purchase-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 7rem;
}
.main-heading {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  text-align: center;
}
.sub-heading {
  font-size: 40px;
  font-weight: 700;
  color: #4e545b;
  text-align: center;
}
.sub-heading .head-yellow {
  color: #fecd1c;
}
.token-purchase__description {
  color: #6e7781;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
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
  font-size: 14px;
  font-weight: 700;
}
@media (min-width: 600px) {
  .token-purchase-bg {
    padding-bottom: 30rem;
  }
  .token-purchase__illustration {
    position: absolute;
    right: 10px;
    width: 90%;
    max-width: 100%;
    bottom: 30px;
    z-index: 1;
    left: auto;
  }
  .token-purchase__title {
    color: #313231;
    font-size: 16px;
    font-weight: 500;
  }
  .token-purchase__description {
    font-size: 20px;
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
    font-size: 24px;
    font-weight: 600;
  }
  .main-heading {
    font-size: 84px;
    font-weight: 700;
  }
  .sub-heading {
    font-size: 96px;
    font-weight: 700;
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
</style>
