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
              src="/images/token/CTA/jupiter.png"
              alt="Jupiter exchange logo"
              class="jupiter-logo"
            />
            <div class="pl-3">Jupiter</div>
          </a>
        </div>
      </div>
      <figure class="token-purchase-figure">
        <img
          src="/images/token/CTA/CTA_People_Desktop.svg"
          alt="People holding Gama tokens illustration"
          class="illustration-desktop"
        />
        <img
          src="/images/token/CTA/CTA_People_Tablet.svg"
          alt="People holding Gama tokens illustration for iPad Mini"
          class="illustration-ipadmini"
        />
        <img
          src="/images/token/CTA/CTA_People_Mobile.svg"
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
  min-height: 100vh;
  padding: 2rem 0;
}

.token-purchase-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  overflow-x: hidden;
  min-height: calc(100vh - 4rem);
}

.token-purchase-content {
  z-index: 2;
  width: 100%;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.token-purchase-figure {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 0;
  padding: 0;
  flex-shrink: 0;
}

.illustration-desktop,
.illustration-ipadmini,
.illustration-androidsmall {
  display: none;
  width: 100%;
  height: auto;
  object-fit: contain;
  margin: 0 auto;
  max-width: 100%;
}

.main-heading {
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin-bottom: 1.2rem;
  line-height: 1.2;
}

.sub-heading {
  font-size: 2.5rem;
  font-weight: 700;
  color: #000000;
  text-align: center;
  margin-top: 0;
  margin-bottom: 2.5rem;
  line-height: 1.2;
}

.sub-heading .head-yellow {
  color: #fecd1c;
}

.token-purchase__description {
  color: #000000;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 2.5rem;
  line-height: 1.5;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.token-purchase__btn {
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 160px;
  border-radius: 6px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.token-purchase__btn:hover {
  transform: scale(1.04);
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}

.token-purchase__btn img {
  width: 27px;
  height: 27px;
}

.token-purchase__title {
  color: #000000;
  font-size: 2.25rem;
  font-weight: 700;
  padding-bottom: 1rem;
  margin-bottom: 1.2rem;
}

/* Mobile First - Base styles for small screens */
@media (max-width: 599px) {
  .token-purchase-bg {
    min-height: auto;
    padding: 1rem 0;
  }
  
  .token-purchase-container {
    padding: 1rem 0.5rem;
    min-height: auto;
  }
  
  .main-heading {
    font-size: 2.75rem;
    padding-top: 1rem;
  }
  
  .sub-heading {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .token-purchase__description {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  }
  
  .token-purchase__btn {
    height: 44px;
    width: 140px;
    font-size: 1.1rem;
  }
  
  .token-purchase__btn img {
    width: 24px;
    height: 24px;
  }
  
  .token-purchase__title {
    font-size: 2.1rem;
  }
  
  .token-purchase-figure {
    margin-top: 1rem;
  }
  
  .illustration-androidsmall {
    display: block;
    max-height: 150px;
    max-width: 300px;
  }
}

/* Tablet styles */
@media (min-width: 600px) and (max-width: 959px) {
  .token-purchase-bg {
    min-height: 100vh;
    padding: 3rem 0;
  }
  
  .token-purchase-container {
    padding: 3rem 2rem;
  }
  
  .main-heading {
    font-size: 7.5rem;
    margin-bottom: 1.5rem;
  }
  
  .sub-heading {
    font-size: 6.5rem;
    margin-bottom: 3.5rem;
  }
  
  .token-purchase__description {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .token-purchase__btn {
    height: 56px;
    width: 180px;
    font-size: 1.5rem;
  }
  
  .token-purchase__btn img {
    width: 32px;
    height: 32px;
  }
  
  .token-purchase__title {
    font-size: 2.5rem;
  }
  
  .illustration-ipadmini {
    display: block;
    max-width: 500px;
  }
}

/* Desktop styles */
@media (min-width: 960px) {
  .token-purchase-bg {
    min-height: 100vh;
    padding: 4rem 0;
  }
  
  .token-purchase-container {
    padding: 4rem 2rem;
  }
  
  .main-heading {
    font-size: 9.25rem;
    margin-bottom: 2rem;
  }
  
  .sub-heading {
    font-size: 8rem;
    margin-bottom: 2rem;
  }
  
  .token-purchase__description {
    font-size: 2rem;
    margin-top: 1rem;
    margin-bottom: 3rem;
  }
  
  .token-purchase__btn {
    height: 68px;
    width: 215px;
    font-size: 2rem;
  }
  
  .token-purchase__btn img {
    width: 40px;
    height: 40px;
  }
  
  .token-purchase__title {
    font-size: 2.75rem;
  }
  
  .illustration-desktop {
    display: block;
    max-width: 800px;
  }
}

/* Large desktop styles */
@media (min-width: 1200px) {
  .main-heading {
    font-size: 9rem;
  }
  
  .sub-heading {
    font-size: 8rem;
    margin-bottom: 4rem;
  }
  
  .token-purchase__description {
    font-size: 2.25rem;
  }
  
  .illustration-desktop {
    max-width: 1000px;
  }
}

@media (max-width: 600px) {
  .main-heading {
    font-size: 2.2rem;
  }
  .sub-heading {
    font-size: 1.5rem;
  }
}
</style>
