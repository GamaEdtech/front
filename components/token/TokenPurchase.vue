<template>
  <div class="token-purchase-bg">
    <div class="token-purchase-container">
      <div class="token-purchase-content">
        <h1 class="main-heading">Join the Movement</h1>
        <h2 class="sub-heading">
          Buy <span class="head-yellow">$GET</span> Today
        </h2>
        <div class="token-purchase__description">
          Empower education. Power the Gama ecosystem.
        </div>
        <div class="d-flex justify-center align-center flex-column mt-8">
          <div class="token-purchase__title mb-1">Buy now on</div>
          <a
            href="https://jup.ag/swap/SOL-GET"
            target="_blank"
            rel="noopener noreferrer"
            class="token-purchase__btn"
          >
            <img
              src="/images/token/jupiter.png"
              alt="Jupiter"
              class="jupiter-logo"
            />
            <div class="pl-3">Jupiter</div>
          </a>
        </div>
      </div>
      <img
        src="/images/token/tokens.png"
        alt="People holding tokens"
        class="token-purchase__illustration"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "TokenPurchase",
};
</script>

<style scoped>
.token-purchase-bg {
  background: linear-gradient(to bottom, #999999, #f2f2f2);
  position: relative;
  overflow: hidden;
  padding-bottom: 40rem;
}
.token-purchase-content {
  position: relative;
  z-index: 3;
}
.token-purchase__illustration {
  position: absolute;
  right: 10px;
  width: 90%;
  max-width: 100%;
  bottom: 30px;
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
  font-size: 84px;
  font-weight: 700;
  color: #fff;
}
.sub-heading {
  font-size: 96px;
  font-weight: 700;
  color: #4e545b;
}
.sub-heading .head-yellow {
  color: #fecd1c;
}
.token-purchase__description {
  color: #24292f;
  font-size: 32px;
  font-weight: 400;
  text-align: center;
}
.token-purchase__btn {
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 68px;
  width: 215px;
  border-radius: 6px;
  font-size: 32px;
  font-weight: 600;
  color: #ffffff;
}
.token-purchase__btn img {
  width: 40px;
  height: 40px;
}
.token-purchase__title {
  color: #313231;
  font-size: 24px;
  font-weight: 600;
}
</style>
