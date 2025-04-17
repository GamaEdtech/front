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

    const {
        scene,
        camera,
        setupScene,
        loadCastleModel,
        startAnimationLoop,
        cleanup: cleanupThree,
        modelLoaded
    } = useThreeJS()

    // Setup the scene with container
    setupScene(container.value)

    // Load the castle model
    loadCastleModel()

    let characterController: ReturnType<typeof useCharacterController> | null = null

    // Initialize character controller when model is loaded
    watch(modelLoaded, (isLoaded) => {
        if (!isLoaded) return

        // Initialize character controller
        characterController = useCharacterController(scene.value, camera.value)
        characterController.createCharacter()
        characterController.setupControls()

        // Start character animation loop
        startCharacterAnimationLoop(characterController)
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

// Extract character animation loop to a separate function
function startCharacterAnimationLoop(controller: ReturnType<typeof useCharacterController>) {
    const animateCharacter = () => {
        controller.updateCharacter()
        requestAnimationFrame(animateCharacter)
    }
    animateCharacter()
}
</script>

<style>
.container {
    margin-top: 8rem;
}
</style>