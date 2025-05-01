<template>
    <div class="main" ref="mainElement">
        <!-- Main game container for ThreeJS rendering -->
        <div ref="container" class="container" />

        <!-- Contextual prompt for door/gate interaction -->
        <InteractionPrompt :opration="promptOpration" v-if="!isMathModalOpen" :is-near="isNear"
            @door-interaction="handleDoorInteraction" @gate-interaction="handleGateInteraction" />

        <!-- Math challenge modal when interacting with doors -->
        <MathModal v-if="isMathModalOpen" @close-math-modal="closeMathModal" :near-door="nearDoor" :level="level"
            :step="step" />

        <!-- Progress indicator -->
        <StepProcess :step="step" />

        <!-- Level advancement modal -->
        <LevelUp @close-level-up-modal="closeLevelUpModal()" :level-up-modal="levelUpModal" :level="level" />

        <!-- Mobile-only controls -->
        <MobileMovementController :isMobileOrTablet="isMobileOrTablet" @moveStart="handleMoveStart"
            @moveEnd="handleMoveEnd" />
        <MobileScreenControls :main-element="mainElement" :isMobileOrTablet="isMobileOrTablet" />

        <!-- Game instructions modal -->
        <HelpModal />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, reactive } from 'vue'
import { useThreeJS } from '../../composables/game/useThreejs'
import { useCharacterController } from '../../composables/game/castle/useCharacterController'
import MathModal from '@/components/game/castle/MathModal.vue'
import useModels from '~/composables/game/castle/useModels'
import InteractionPrompt from '../../components/game/castle/interactionPrompt.vue'
import * as THREE from "three"
import StepProcess from '~/components/game/castle/stepProcess.vue'
import LevelUp from '~/components/game/castle/levelUp.vue'
import MobileMovementController from '~/components/game/castle/mobileMovementController.vue'
import MobileScreenControls from '~/components/game/castle/mobileScreenControls.vue'
import HelpModal from '~/components/game/castle/helpModal.vue'
import { DoorModels } from '~/interfaces/DoorModels.interface'
import { Level, Step } from '~/interfaces/DoorStatus'

// ==========================================
// State Management
// ==========================================

// Core game state
const level = ref<number>(1)              // Current game level
const step = ref<number>(1)               // Current step within level
const modelesLoaded = ref<boolean>(false) // Flag for 3D models loading status
const isNear = ref(false)                 // Player proximity to interactive objects
const isMathModalOpen = ref(false)        // Controls math challenge visibility
const levelUpModal = ref<boolean>(false)  // Controls level advancement modal
const promptOpration = ref<string>("")    // Current interaction prompt type

// Device detection
const isMobile = ref(false)
const isMobileOrTablet = computed(() => {
    // Check for mobile OR tablet based on user agent or screen width
    return isMobile.value || (window.innerWidth <= 1024);
});

// DOM references
const mainElement = ref<HTMLDivElement | null>(null)
const container = ref<HTMLDivElement | null>(null)

// 3D objects references
const characterContainer = ref<THREE.Object3D<THREE.Object3DEventMap>>()
let characterController: ReturnType<typeof useCharacterController> | null = null

// Tracks which door player is near
const nearDoor = ref<"door001" | "door002" | "door003" | "door004" | null>(null);

// Game progress tracking - which doors have been solved
const openedDoors = ref<Level[]>([
    {
        id: 'level1',
        steps: {
            step1: { door001: false, door002: false, door003: false, door004: false },
            step2: { door001: false, door002: false, door003: false, door004: false },
            step3: { door001: false, door002: false, door003: false, door004: false },
            step4: { door001: false, door002: false, door003: false, door004: false }
        }
    },
    {
        id: 'level2',
        steps: {
            step1: { door001: false, door002: false, door003: false, door004: false },
            step2: { door001: false, door002: false, door003: false, door004: false },
            step3: { door001: false, door002: false, door003: false, door004: false },
            step4: { door001: false, door002: false, door003: false, door004: false }
        }
    }
]);

// References to 3D door models
const doorModels = reactive<DoorModels>({
    door001: { model: null },
    door002: { model: null },
    door003: { model: null },
    door004: { model: null }
})

// ==========================================
// Helper Functions
// ==========================================

/**
 * Detects if the current device is mobile/tablet based on user agent and screen size
 */
const detectDevice = () => {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isSmallScreen = window.innerWidth <= 1024;
    isMobile.value = mobileRegex.test(navigator.userAgent) || isSmallScreen;
};

/**
 * Handles window resize events for responsive behavior
 */
const handleResize = () => {
    detectDevice();
};

/**
 * Starts the character animation loop
 * @param controller The character controller instance
 */
function startCharacterAnimationLoop(controller: ReturnType<typeof useCharacterController>) {
    const animateCharacter = () => {
        controller.updateCharacter()
        requestAnimationFrame(animateCharacter)
    }
    animateCharacter()
}

// ==========================================
// Event Handlers
// ==========================================

/**
 * Handles the closing of the math challenge modal
 * @param isProblemSolved Whether the math problem was correctly solved
 */
const closeMathModal = (isProblemSolved: boolean) => {
    isMathModalOpen.value = false;

    if (isProblemSolved && nearDoor.value) {
        // Mark the door as solved in game state
        const stepKey = `step${step.value}` as keyof Step;
        openedDoors.value[level.value - 1].steps[stepKey as 'step1' | "step2" | "step3" | "step4"][nearDoor.value as "door001" | "door002" | "door003"] = true;

        // Return to pointer lock on desktop
        if (!isMobileOrTablet.value) {
            container.value!.requestPointerLock()
        }
    }
}

/**
 * Handles door interaction events (when player presses E key or taps interact)
 */
const handleDoorInteraction = () => {
    console.log("Door interaction triggered");
    // Exit pointer lock on desktop
    if (!isMobileOrTablet.value) {
        document.exitPointerLock();
    }
    isMathModalOpen.value = true;
}

/**
 * Handles gate interaction to progress to next step or level
 */
const handleGateInteraction = () => {
    console.log("Gate interaction triggered");

    // Prevent progressing beyond available levels
    if (level.value > openedDoors.value.length) return

    let lastStep = false
    step.value += 1

    // Check if this is the final step in the level
    if (step.value === 5) {
        lastStep = true
    }

    // Handle level completion
    if (lastStep) {
        levelUpModal.value = true
        level.value += 1
        step.value = 1
        lastStep = false
    }

    // Reset character position
    if (characterContainer.value) {
        characterContainer.value.position.set(0, 50, 450)
    }

    // Reset door rotations
    for (const door in doorModels) {
        doorModels[door as "door001" | 'door002' | 'door003' | 'door004'].model?.rotation.set(0, 0, -1.564)
    }
}

/**
 * Closes the level up modal
 */
const closeLevelUpModal = () => {
    levelUpModal.value = false
}

/**
 * Handles the start of movement from mobile controls
 * @param direction The direction to move (forward, backward, left, right)
 */
const handleMoveStart = (direction: string) => {
    if (!characterController) return;

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

/**
 * Handles the end of movement from mobile controls
 * @param direction The direction that stopped moving
 */
const handleMoveEnd = (direction: string) => {
    if (!characterController) return;

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

// ==========================================
// Lifecycle Hooks
// ==========================================

onMounted(() => {
    if (!container.value) return

    console.log("Castle page mounted, initializing scene")

    // Initialize device detection
    detectDevice();
    window.addEventListener('resize', handleResize);

    // Initialize ThreeJS
    const {
        scene,
        camera,
        setupScene,
        startAnimationLoop,
        cleanup: cleanupThree
    } = useThreeJS()

    // Set up the 3D scene in the container
    setupScene(container.value, modelesLoaded)

    // Load 3D models for the scene
    useModels(scene, doorModels, modelesLoaded)

    // Watch for models to finish loading
    watch(modelesLoaded, (isLoaded) => {
        if (!isLoaded) return

        console.log("Castle model loaded, initializing character controller")

        // Initialize character controller now that models are loaded
        characterController = useCharacterController(
            scene.value,
            camera.value,
            container.value!,
            doorModels,
            openedDoors.value,
            nearDoor,
            level,
            step
        )

        characterController.createCharacter()
        characterController.setupControls()
        characterContainer.value = characterController.characterContainer

        // Start the character animation loop
        startCharacterAnimationLoop(characterController)

        // Watch for proximity to interactive objects
        watch(
            () => [
                characterController?.isNearDoor.value,
                characterController?.isNearGate.value,
            ],
            (newValue, oldValue) => {
                const [newDoorStatus, newGateStatus] = newValue || []
                const [oldDoorStatus, oldGateStatus] = oldValue || []

                // Update interaction prompt for gates
                if (newGateStatus !== oldGateStatus) {
                    isNear.value = newGateStatus!
                    isNear.value ? (promptOpration.value = 'gate') : (promptOpration.value = '')
                }

                // Update interaction prompt for doors
                if (newDoorStatus !== oldDoorStatus) {
                    isNear.value = newDoorStatus!
                    isNear.value ? (promptOpration.value = 'door') : (promptOpration.value = '')
                }
            },
            { immediate: true }
        )
    })

    // Start the main ThreeJS rendering loop
    startAnimationLoop()

    // Cleanup when component unmounts
    onUnmounted(() => {
        cleanupThree()
        if (characterController) {
            characterController.cleanup()
        }
        window.removeEventListener('resize', handleResize);
    })
})
</script>

<style>
/* Game container styles */
.container {
    width: 100%;
    height: calc(100vh - 8rem);
    position: relative;
}

/* Main wrapper styles */
.main {
    position: relative;
    margin-top: 8rem;
    /* Space for header/navigation */
}
</style>