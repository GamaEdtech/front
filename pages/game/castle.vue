<template>
    <div class="main" ref="mainElement">
        <div ref="container" class="container" />
        <InteractionPrompt :opration="promptOpration" v-if="!isMathModalOpen" :is-near="isNear"
            @door-interaction="handleDoorInteraction" @gate-interaction="handleGateInteraction" />
        <MathModal v-if="isMathModalOpen" @close-math-modal="closeMathModal" />
        <StepProcess />
        <LevelUp @close-level-up-modal="closeLevelUpModal()" :level-up-modal="levelUpModal" />

        <!-- Mobile movement controller - only on mobile/tablet -->
        <MobileMovementController :isMobileOrTablet="isMobileOrTablet" @moveStart="handleMoveStart"
            @moveEnd="handleMoveEnd" />

        <!-- Mobile screen controls - only on mobile/tablet -->
        <MobileScreenControls :main-element="mainElement" :isMobileOrTablet="isMobileOrTablet" />

        <HelpModal />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useThreeJS } from '../../composables/game/castle/useThreejs'
import { useCharacterController } from '../../composables/game/castle/useCharacterController'
import MathModal from '@/components/game/castle/MathModal.vue'
import { openedDoors, nearDoor, type Step } from '@/store/doorStatus'
import level from "@/store/level"
import step from "@/store/step"
import modelesLoaded from '~/store/modelsLoaded'
import useModels from '~/composables/game/castle/useModels'
import InteractionPrompt from '../../components/game/castle/interactionPrompt.vue'
import * as THREE from "three"
import { doorModels } from '~/store/doorModels'
import StepProcess from '~/components/game/castle/stepProcess.vue'
import LevelUp from '~/components/game/castle/levelUp.vue'
import MobileMovementController from '~/components/game/castle/mobileMovementController.vue'
import MobileScreenControls from '~/components/game/castle/mobileScreenControls.vue'
import HelpModal from '~/components/game/castle/helpModal.vue'

const promptOpration = ref<string>("")

const mainElement = ref<HTMLDivElement | null>(null)
const container = ref<HTMLDivElement | null>(null)
const isNear = ref(false)
const isMathModalOpen = ref(false)
const characterContainer = ref<THREE.Object3D<THREE.Object3DEventMap>>()
const levelUpModal = ref<boolean>(false)
const isMobile = ref(false)
let characterController: ReturnType<typeof useCharacterController> | null = null

// Computed property for device type detection
const isMobileOrTablet = computed(() => {
    // Check for mobile OR tablet (based on screen width)
    return isMobile.value || (window.innerWidth <= 1024);
});

// Function to detect mobile or tablet device
const detectDevice = () => {
    // Check by user agent
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    // Check by screen size
    const isSmallScreen = window.innerWidth <= 1024;

    isMobile.value = mobileRegex.test(navigator.userAgent) || isSmallScreen;
};

const closeMathModal = (isProblemSolved: boolean) => {
    isMathModalOpen.value = false;
    if (isProblemSolved) {
        const stepKey = `step${step.value}` as keyof Step;

        openedDoors.value[level.value - 1].steps[stepKey as 'step1' | "step2" | "step3" | "step4"][nearDoor.value as "door001" | "door002" | "door003"] = true;
        if (!isMobileOrTablet.value) {
            container.value!.requestPointerLock()
        }
    }
}

// Handle door interaction when user presses E key
const handleDoorInteraction = () => {
    console.log("Door interaction handled in castle.vue!");
    if (!isMobileOrTablet.value) {
        document.exitPointerLock();
    }
    isMathModalOpen.value = true;
}

const closeLevelUpModal = () => {
    levelUpModal.value = false
}

const handleGateInteraction = () => {
    console.log("Gate interaction handled in castle.vue!");
    if (level.value > openedDoors.value.length) return
    let lastStep = false

    if (step.value <= 4) {
        step.value += 1
        lastStep = true
    }
    if (lastStep) {
        levelUpModal.value = true
        level.value += 1
        step.value = 1
        lastStep = false
    }

    if (characterContainer.value) {
        characterContainer.value.position.set(0, 50, 450)
    }

    for (const door in doorModels) {
        doorModels[door as "door001" | 'door002' | 'door003' | 'door004'].model?.rotation.set(0, 0, -1.564)
    }
}

// Mobile movement handlers
const handleMoveStart = (direction: string) => {
    if (!characterController) return;

    // Set the corresponding movement state to true
    switch (direction) {
        case 'forward':
            characterController.moveState.forward = true;
            break;
        case 'backward':
            characterController.moveState.backward = true;
            break;
        case 'left':
            characterController.moveState.left = true;
            break;
        case 'right':
            characterController.moveState.right = true;
            break;
    }
}

const handleMoveEnd = (direction: string) => {
    if (!characterController) return;

    // Set the corresponding movement state to false
    switch (direction) {
        case 'forward':
            characterController.moveState.forward = false;
            break;
        case 'backward':
            characterController.moveState.backward = false;
            break;
        case 'left':
            characterController.moveState.left = false;
            break;
        case 'right':
            characterController.moveState.right = false;
            break;
    }
}

// Resize event handler for responsive behavior
const handleResize = () => {
    detectDevice();
};

onMounted(() => {
    if (!container.value) return

    console.log("Castle page mounted, initializing scene")

    // Detect device type
    detectDevice();

    // Add resize listener for responsive behavior
    window.addEventListener('resize', handleResize);

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
        window.removeEventListener('resize', handleResize);
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
    width: 100%;
    height: calc(100vh - 8rem);
    position: relative;
}

.main {
    position: relative;
    margin-top: 8rem;
}
</style>