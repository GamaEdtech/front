<template>
    <div>
        <div ref="container" class="container" />
        <DoorInteractionPrompt :is-near-door="isNearDoor" @door-interaction="handleDoorInteraction" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useThreeJS } from '../../composables/game/castle/useThreejs'
import { useCharacterController } from '../../composables/game/castle/useCharacterController'
import DoorInteractionPrompt from '../../components/game/castle/DoorInteractionPrompt.vue'
import { openedDoors, nearDoor } from '@/store/doorStatus'

const container = ref<HTMLDivElement | null>(null)
const isNearDoor = ref(false)

// Handle door interaction when user presses E key
const handleDoorInteraction = () => {
    console.log("Door interaction handled in castle.vue!");

    openedDoors[nearDoor.value as keyof typeof openedDoors] = true;
    // Here you would add code to actually open the door in the 3D scene
}

onMounted(() => {
    if (!container.value) return

    console.log("Castle page mounted, initializing scene")

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

        console.log("Castle model loaded, initializing character controller")

        // Initialize character controller
        characterController = useCharacterController(scene.value, camera.value)
        characterController.createCharacter()
        characterController.setupControls()

        // Start character animation loop
        startCharacterAnimationLoop(characterController)

        // Watch for door proximity changes
        watch(() => characterController?.isNearDoor.value, (newValue) => {
            console.log("Door proximity from controller:", newValue)
            if (newValue !== undefined) {
                isNearDoor.value = newValue
            }
        }, { immediate: true })
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
    width: 100%;
    height: calc(100vh - 8rem);
    position: relative;
}
</style>