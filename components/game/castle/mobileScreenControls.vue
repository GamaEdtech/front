<template>
  <div
    class="screen-controls"
    :style="{ top: isFullscreen ? '2rem' : '7rem' }"
  >
    <v-btn
      :icon="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
      color="#ffb300"
      class="control-btn"
      density="comfortable"
      variant="elevated"
      @click="toggleFullscreen"
    />
    <v-btn
      v-if="isMobileOrTablet"
      icon="mdi-screen-rotation"
      color="#ffb300"
      class="control-btn ml-2"
      density="comfortable"
      variant="elevated"
      @click="requestRotation"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

const props = defineProps<{
  isMobileOrTablet: boolean
  mainElement: HTMLDivElement | null
}>()

const isFullscreen = ref(false)
const mainComponent = computed(() => props.mainElement)

// Check if fullscreen is supported
const fullscreenAvailable = ref(false)

onMounted(() => {
  // Check for fullscreen API support
  updateFullscreenAvailability()

  // Listen for fullscreen change events
  document.addEventListener('fullscreenchange', updateFullscreenStatus)
  document.addEventListener('webkitfullscreenchange', updateFullscreenStatus)
  document.addEventListener('mozfullscreenchange', updateFullscreenStatus)
  document.addEventListener('MSFullscreenChange', updateFullscreenStatus)
})

onUnmounted(() => {
  // Clean up event listeners
  document.removeEventListener('fullscreenchange', updateFullscreenStatus)
  document.removeEventListener('webkitfullscreenchange', updateFullscreenStatus)
  document.removeEventListener('mozfullscreenchange', updateFullscreenStatus)
  document.removeEventListener('MSFullscreenChange', updateFullscreenStatus)
})

// Watch for changes in mainElement prop
watch(() => props.mainElement, () => {
  updateFullscreenAvailability()
})

const updateFullscreenAvailability = () => {
  fullscreenAvailable.value = !!mainComponent.value?.requestFullscreen
    || !!(mainComponent.value as any)?.webkitRequestFullscreen
    || !!(mainComponent.value as any)?.mozRequestFullScreen
    || !!(mainComponent.value as any)?.msRequestFullscreen
  console.log('Fullscreen available:', fullscreenAvailable.value)
}

// Update fullscreen status
const updateFullscreenStatus = () => {
  isFullscreen.value = Boolean(
    document.fullscreenElement
    || (document as any).webkitFullscreenElement
    || (document as any).mozFullScreenElement
    || (document as any).msFullscreenElement,
  )
  console.log('Fullscreen status:', isFullscreen.value)
}

// Toggle fullscreen mode
const toggleFullscreen = async () => {
  if (!fullscreenAvailable.value || !mainComponent.value) {
    console.error('Fullscreen is not available or mainComponent is null')
    return
  }

  try {
    if (!isFullscreen.value) {
      // Enter fullscreen
      if (mainComponent.value.requestFullscreen) {
        await mainComponent.value.requestFullscreen()
      }
      else if ((mainComponent.value as any).webkitRequestFullscreen) {
        await (mainComponent.value as any).webkitRequestFullscreen()
      }
      else if ((mainComponent.value as any).mozRequestFullScreen) {
        await (mainComponent.value as any).mozRequestFullScreen()
      }
      else if ((mainComponent.value as any).msRequestFullscreen) {
        await (mainComponent.value as any).msRequestFullscreen()
      }
    }
    else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      }
      else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen()
      }
      else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen()
      }
      else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen()
      }
    }
  }
  catch (error) {
    console.error('Error toggling fullscreen:', error)
  }
}

// Request screen rotation
const requestRotation = () => {
  try {
    // Check if the Screen Orientation API is available
    if (screen.orientation && typeof (screen.orientation as any).lock === 'function') {
      if (screen.orientation.type.includes('portrait')) {
        (screen.orientation as any).lock('landscape').catch((err: any) => {
          console.warn('Screen orientation lock request failed:', err)
          // alert('Screen orientation lock is not available on this device. Please rotate your device manually.');
          alert('Screen orientation lock is not available on this device. Please rotate your device manually.')
        })
      }
      else {
        (screen.orientation as any).lock('portrait').catch((err: any) => {
          console.warn('Screen orientation lock request failed:', err)
          alert('Please first go to full screan mode then touch routate device')
        })
      }
    }
    else {
      // Fallback - just notify user to rotate manually
      alert('Screen orientation lock is not available on this device. Please rotate your device manually.')
    }
  }
  catch (error) {
    console.error('Error requesting rotation:', error)
    alert('Please rotate your device manually')
  }
}
</script>

<style scoped>
.screen-controls {
    position: absolute;
    right: 2rem;
    z-index: 100;
    display: flex;
}

.control-btn {
    opacity: 0.8;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
}

@media (min-width: 1025px) {
    .screen-controls {
        top: 2rem !important;
        right: 2rem;
    }
}
</style>
