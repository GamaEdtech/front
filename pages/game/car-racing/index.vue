<template>
    <div>
        <canvas id="canvas" class="wrbgl"></canvas>

        <div class="buttons-div">
            <button @click="turnLeft" class="change-lane-btn">
                Left
            </button>
            <button @click="turnRight" class="change-lane-btn">
                Right
            </button>
        </div>
    </div>
</template>


<script>
import Experience from "./ThreeJsExperience/Experience.js";

export default {
    auth: false,
    data() {
        return {
            experience: null
        };
    },
    mounted() {
        this.experience = new Experience(document.getElementById("canvas"))
    },
    onUnmounted() {
        this.experience.destroy()
    },
    methods: {
        turnRight() {
            this.experience.changeLane(1)
        },
        turnLeft() {
            this.experience.changeLane(-1)
        }
    }
};
</script>


<style scoped>
.wrbgl {
    position: absolute;
    top: 0;
    left: 0;
    outline: none;
    z-index: 2;
}

.buttons-div {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 10px;
    position: absolute;
    bottom: 20px;
    width: 100%;
    z-index: 2;
}

.change-lane-btn {
    width: 150px;
    height: 60px;
    border-radius: 6px;
    background-color: white;
    border: none;
    transition: 0.5s;
}

.change-lane-btn:active {
    transform: scale(0.96);
}
</style>