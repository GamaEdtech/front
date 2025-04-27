<template>
    <div>
        <div ref="container" class="container" />
        <InteractionPrompt :opration="promptOpration" v-if="!isMathModalOpen" :is-near="isNear"
            @door-interaction="handleDoorInteraction" @gate-interaction="handleGateInteraction"/>
        <MathModal v-if="isMathModalOpen" @close-math-modal="closeMathModal" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useThreeJS } from '../../composables/game/castle/useThreejs'
import { useCharacterController } from '../../composables/game/castle/useCharacterController'
import MathModal from '@/components/game/castle/MathModal.vue'
import { openedDoors, nearDoor, type Step } from '@/store/doorStatus'
import level from "@/store/level"
import step from "@/store/step"
import useCastleModel from '~/composables/game/castle/useCastleModel'
import modelesLoaded from '~/store/modelsLoaded'
import useModels from '~/composables/game/castle/useModels'
import InteractionPrompt from '../../components/game/castle/interactionPrompt.vue'
import * as THREE from "three"
import { doorModels } from '~/store/doorModels'

const promptOpration = ref<string>("")

const container = ref<HTMLDivElement | null>(null)
const isNear = ref(false)
const isMathModalOpen = ref(false)
const characterContainer = ref<THREE.Object3D<THREE.Object3DEventMap>>()

const closeMathModal = () => {
    isMathModalOpen.value = false;
    const stepKey = `step${step.value}` as keyof Step;

    openedDoors.value[level.value-1].steps[stepKey as 'step1' | "step2" | "step3" | "step4"][nearDoor.value as "door001" | "door002" | "door003"] = true;
    container.value!.requestPointerLock()
}

// Handle door interaction when user presses E key
const handleDoorInteraction = () => {
    console.log("Door interaction handled in castle.vue!");
    document.exitPointerLock();
    isMathModalOpen.value = true;
}

const handleGateInteraction = () => {
    console.log("Door interaction handled in castle.vue!");
    if (level.value > openedDoors.value.length) return

    if (step.value <= 4) {
        step.value += 1
    }
    if (step.value === 4) {
        level.value += 1
        step.value = 1
    }

    if (characterContainer.value) {
        characterContainer.value.position.set(0, 50, 450)
    }

    for (const door in doorModels) {
        doorModels[door as "door001" | 'door002' | 'door003' | 'door004'].model?.rotation.set(0, 0, -1.564)
    }
}

onMounted(() => {
    if (!container.value) return

    console.log("Castle page mounted, initializing scene")

    const {
        scene,
        camera,
        setupScene,
        startAnimationLoop,
        cleanup: cleanupThree
    } = useThreeJS()

    

    // Setup the scene with container
    setupScene(container.value)

    useModels(scene)

    let characterController: ReturnType<typeof useCharacterController> | null = null

    // Initialize character controller when model is loaded
    watch(modelesLoaded, (isLoaded) => {
        if (!isLoaded) return

        console.log("Castle model loaded, initializing character controller")


        // Initialize character controller
        characterController = useCharacterController(scene.value, camera.value, container.value!)
        characterController.createCharacter()
        characterController.setupControls()
        characterContainer.value = characterController.characterContainer

        // Start character animation loop
        startCharacterAnimationLoop(characterController)

        // Watch for door proximity changes
        watch(
            () => [
                characterController?.isNearDoor.value,
                characterController?.isNearGate.value,
            ],
            (newValue, oldValue) => {
                const [newDoorStatus, newGateStatus] = newValue || []
                const [oldDoorStatus, oldGateStatus] = oldValue || []

                if (newGateStatus !== oldGateStatus) {
                    isNear.value = newGateStatus!
                    isNear.value ? (promptOpration.value = 'gate') : (promptOpration.value = '')
                }
                if (newDoorStatus !== oldDoorStatus) {
                    isNear.value = newDoorStatus!
                    isNear.value ? (promptOpration.value = 'door') : (promptOpration.value = '')
                }
            },
            { immediate: true }
        )
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