<template>
    <div class="main-car-racing-div" id="car-racing-container">
        <div class="container container-car-racing">
            <div class="text-button-div">
                <h2 class="gama-text-h4">Ready to Race?</h2>
                <span class="gama-text-body1 extra-style-description">
                    Learning has never been this exciting! Get behind the wheel, think fast, choose the right path, and
                    speed ahead. Play, learn, and become a champion!
                </span>

                <v-btn rounded :large="$vuetify.breakpoint.mdAndUp" :small="$vuetify.breakpoint.xs"
                    to="/game/car-racing" class="primary gama-btn">Let's go!</v-btn>
            </div>
            <div class="image-car-div">
                <img height="280" width="280" class="car-racing-image" src="/images/car-racing-banner.webp"
                    alt="Car Racing Banner">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "car-racing-banner",
    data() {
        return {
        };
    },
};
</script>

<style scoped>
.main-car-racing-div {
    width: 100%;
    min-height: 380px;
    background-color: #F6F8FA;
    padding: 15px 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container-car-racing {
    display: flex;
    align-items: center;
    justify-content: space-between;
    row-gap: 30px;
}

.text-button-div {
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    row-gap: 30px;
}

.extra-style-description {
    width: 80%;
    color: #6E7781;
}

.image-car-div {
    width: 40%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.car-racing-image {
    width: 280px;
    height: 280px;
}

@media (max-width: 960px) {
    .car-racing-image {
        width: 240px;
        height: 240px;
    }
}

@media (max-width: 600px) {
    .image-car-div {
        width: 100%;
        justify-content: center;
    }

    .container-car-racing {
        flex-direction: column-reverse;
    }

    .text-button-div {
        width: 100%;
        align-items: center;
    }

    .extra-style-description {
        width: 100%;
    }
}
</style>
