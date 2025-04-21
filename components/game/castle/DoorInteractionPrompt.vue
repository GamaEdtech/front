<template>
    <v-fade-transition>
        <v-card v-if="isNearDoor" class="door-interaction-prompt" elevation="10" color="grey-darken-3" rounded="lg">
            <v-card-text class="pa-4 text-center">
                <div class="d-flex align-center justify-center mb-2">
                    <v-icon icon="mdi-door-open" size="large" color="primary" class="mr-2"></v-icon>
                    <span class="text-h6 font-weight-medium">Door Interaction</span>
                </div>

                <v-divider class="my-2"></v-divider>

                <p v-if="isMobile" class="mb-2">Press below button to fix math problem and open the door</p>
                <p v-else class="mb-2">Press <kbd>E</kbd> to fix math problem and open the door</p>

                <v-btn @click="handleKeyPress" variant="tonal" color="primary" block class="mt-2">
                    <v-icon start>mdi-keyboard</v-icon>
                    <span v-if="!isMobile">Press E key</span>
                    <span v-else>Fix problem</span>
                </v-btn>
            </v-card-text>
        </v-card>
    </v-fade-transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { useDeviceDetection } from '@/store/device';

const { isMobile } = useDeviceDetection();

const props = defineProps<{
    isNearDoor: boolean;
}>();

const emit = defineEmits(['doorInteraction']);

// Handle keyboard interaction
const handleKeyPress = (event: KeyboardEvent) => {
    if (isMobile.value && props.isNearDoor) {
        emit('doorInteraction');
    }else{
        if (event.code === 'KeyE' && props.isNearDoor) {
            console.log('Door interaction triggered via E key');
            emit('doorInteraction');
        }
    }
};

// Setup and cleanup keyboard listeners
onMounted(() => {
    window.addEventListener('keydown', handleKeyPress);
    console.log("Door interaction component mounted, listening for key E");
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress);
});

// Debug log when door proximity changes
watch(() => props.isNearDoor, (newValue) => {
    console.log("Door proximity changed in component:", newValue);
});
</script>

<style>
.door-interaction-prompt {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, -120%);
    max-width: 350px;
    width: 90%;
    z-index: 9999;
    /* Ensure it's on top of everything */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
    opacity: 1 !important;
}

kbd {
    background-color: #444;
    color: white;
    padding: 3px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-weight: bold;
    display: inline-block;
    margin: 0 4px;
}
</style>