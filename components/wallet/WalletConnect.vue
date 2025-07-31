<template>
  <div class="wallet-connect">
    <!-- Connection Status Display -->
    <div
      v-if="solanaStore.connected"
      class="wallet-connected"
    >
      <div class="wallet-info">
        <v-icon
          class="wallet-icon"
          color="success"
        >
          mdi-wallet
        </v-icon>
        <div class="wallet-details">
          <span class="wallet-address">{{ solanaStore.truncatedAddress }}</span>
          <span class="wallet-status">Connected</span>
        </div>
      </div>
      <v-btn
        :variant="variant || 'outlined'"
        :size="size || 'default'"
        color="error"
        :loading="disconnecting"
        @click="handleDisconnect"
      >
        <v-icon start>
          mdi-logout
        </v-icon>
        Disconnect
      </v-btn>
    </div>

    <!-- Connection Button -->
    <div
      v-else
      class="wallet-disconnected"
    >
      <v-btn
        :variant="variant || 'elevated'"
        :size="size || 'default'"
        color="primary"
        :loading="solanaStore.connecting"
        :disabled="solanaStore.connecting"
        @click="handleConnect"
      >
        <v-icon start>
          mdi-wallet-plus
        </v-icon>
        {{ solanaStore.connecting ? 'Connecting...' : 'Connect Wallet' }}
      </v-btn>
    </div>

    <!-- Error Display -->
    <v-alert
      v-if="solanaStore.hasError"
      type="error"
      variant="tonal"
      class="mt-3"
      closable
      @click:close="solanaStore.clearError"
    >
      <div class="error-content">
        <strong>Connection Error</strong>
        <p>{{ solanaStore.error }}</p>
        <v-btn
          v-if="isPhantomNotInstalled"
          variant="text"
          color="error"
          href="https://phantom.app/"
          target="_blank"
          size="small"
          class="mt-2"
        >
          <v-icon start>
            mdi-download
          </v-icon>
          Install Phantom Wallet
        </v-btn>
      </div>
    </v-alert>

    <!-- Loading Indicator -->
    <div
      v-if="solanaStore.connecting"
      class="loading-indicator mt-3"
    >
      <v-progress-linear
        indeterminate
        color="primary"
      />
      <p class="text-center text-caption mt-2">
        Please check your wallet for connection request...
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSolanaStore } from '~/stores/solana'

// Props
defineProps({
  variant: {
    type: String,
    default: null,
    validator: value => [
      'elevated', 'flat', 'tonal', 'outlined', 'text', 'plain',
    ].includes(value),
  },
  size: {
    type: String,
    default: null,
    validator: value => ['x-small', 'small', 'default', 'large', 'x-large'].includes(value),
  },
})

// Store
const solanaStore = useSolanaStore()

// Local state
const disconnecting = ref(false)

// Computed
const isPhantomNotInstalled = computed(() => {
  return solanaStore.error && solanaStore.error.includes('not installed')
})

// Methods
const handleConnect = async () => {
  try {
    await solanaStore.connect()
  }
  catch (error) {
    // Error is already handled in the store
    console.error('Connection failed:', error)
  }
}

const handleDisconnect = async () => {
  try {
    disconnecting.value = true
    await solanaStore.disconnect()
  }
  catch (error) {
    console.error('Disconnect failed:', error)
  }
  finally {
    disconnecting.value = false
  }
}

// Auto-reconnect on component mount
onMounted(() => {
  solanaStore.autoReconnect()
})
</script>

<style scoped>
.wallet-connect {
  max-width: 400px;
}

.wallet-connected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border: 1px solid rgb(var(--v-theme-outline));
  border-radius: 8px;
  background-color: rgb(var(--v-theme-surface-variant));
}

.wallet-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.wallet-icon {
  font-size: 24px;
}

.wallet-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wallet-address {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  font-size: 14px;
  color: rgb(var(--v-theme-on-surface));
}

.wallet-status {
  font-size: 12px;
  color: rgb(var(--v-theme-success));
  font-weight: 500;
}

.wallet-disconnected {
  display: flex;
  justify-content: center;
}

.error-content {
  width: 100%;
}

.error-content p {
  margin: 8px 0 0 0;
  font-size: 14px;
}

.loading-indicator {
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .wallet-connected {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .wallet-info {
    justify-content: center;
  }
}
</style>
