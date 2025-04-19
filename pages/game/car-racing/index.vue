<template>
    <canvas id="canvas" class="wrbgl"></canvas>
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
</style>