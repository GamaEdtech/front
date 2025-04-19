import { useState } from 'nuxt/app'
import { onMounted, onUnmounted } from 'vue'

export const useDeviceDetection = () => {
    const isMobile = useState('device-is-mobile', () => false)
    const isPC = useState('device-is-pc', () => true)

    const detectDevice = () => {
        // Only run on client side
        if (process.client) {
            // Simple detection based on user agent and screen width
            const userAgent = navigator.userAgent.toLowerCase()
            const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'windows phone', 'mobile']

            // Check if any mobile keywords are in the user agent
            const mobileDetected = mobileKeywords.some(keyword => userAgent.includes(keyword))

            // Also consider screen width as a factor (devices under 768px are considered mobile)
            const smallScreen = window.innerWidth < 768

            // Set device type based on detection
            isMobile.value = mobileDetected || smallScreen
            isPC.value = !isMobile.value
        }
    }

    if (process.client) {
        onMounted(() => {
            detectDevice()

            // Update on resize for when orientation changes or window is resized
            window.addEventListener('resize', detectDevice)
        })

        // Clean up event listener
        onUnmounted(() => {
            window.removeEventListener('resize', detectDevice)
        })
    }

    return {
        isMobile,
        isPC,
        detectDevice
    }
}
