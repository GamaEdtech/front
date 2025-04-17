<template>
    <div ref="container" class="container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useThreeJS } from '../../composables/game/castle/useThreejs'
import { useCharacterController } from '../../composables/game/castle/useCharacterController'

const container = ref<HTMLDivElement | null>(null)

onMounted(() => {
    if (!container.value) return

    // Initialize Three.js
    const {
        scene,
        camera,
        setupScene,
        loadCastleModel,
        startAnimationLoop,
        cleanup: cleanupThree,
        modelLoaded
    } = useThreeJS()

    // Setup the scene
    setupScene(container.value)

    // Load the castle model
    loadCastleModel()

    // Initialize character controller with unwrapped values
    let characterController: ReturnType<typeof useCharacterController> | null = null

    // Watch for model to load before creating character
    watch(modelLoaded, (isLoaded) => {
        if (isLoaded) {
            // Initialize character controller now that Material2006 objects are identified
            characterController = useCharacterController(scene.value, camera.value)

            // Create character
            characterController.createCharacter()

            // Setup controls
            characterController.setupControls()

            // Start the animation loop with character updates
            const animateCharacter = () => {
                if (characterController) {
                    characterController.updateCharacter()
                }
                requestAnimationFrame(animateCharacter)
            }
            animateCharacter()
        }
    })

    // Start the main rendering loop
    startAnimationLoop()

    // Cleanup on component unmount
    onUnmounted(() => {
        cleanupThree()
        if (characterController) {
            characterController.cleanup()
        }
    })
})
</script>

<style>
.container{
    margin-top: 8rem;
}
</style>