<template>
  <div class="wallet-test-page">
    <v-container>
      <v-row justify="center">
        <v-col
          cols="12"
          md="8"
          lg="6"
        >
          <v-card class="pa-6">
            <v-card-title class="text-h4 text-center mb-4">
              Solana Wallet Test
            </v-card-title>

            <v-card-text>
              <p class="text-body-1 mb-4">
                This page is for testing the Solana wallet integration.
                Make sure you have Phantom wallet installed in your browser.
              </p>

              <!-- Wallet Connect Component -->
              <div class="wallet-section mb-6">
                <h3 class="text-h6 mb-3">
                  Wallet Connection
                </h3>
                <WalletConnect />
              </div>

              <!-- Store State Display -->
              <div class="store-state-section">
                <h3 class="text-h6 mb-3">
                  Store State (Debug Info)
                </h3>
                <v-card
                  variant="outlined"
                  class="pa-4"
                >
                  <pre class="debug-info">{{ storeState }}</pre>
                </v-card>
              </div>

              <!-- Test Actions -->
              <div
                v-if="solana.connected.value"
                class="test-actions mt-6"
              >
                <h3 class="text-h6 mb-3">
                  Test Actions
                </h3>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-btn
                      block
                      variant="outlined"
                      color="primary"
                      :loading="signingMessage"
                      @click="testSignMessage"
                    >
                      Test Sign Message
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-btn
                      block
                      variant="outlined"
                      color="secondary"
                      @click="refreshConnection"
                    >
                      Refresh Connection
                    </v-btn>
                  </v-col>
                </v-row>
              </div>

              <!-- Test Results -->
              <div
                v-if="testResults.length > 0"
                class="test-results mt-6"
              >
                <h3 class="text-h6 mb-3">
                  Test Results
                </h3>
                <v-card
                  variant="outlined"
                  class="pa-4"
                >
                  <div
                    v-for="(result, index) in testResults"
                    :key="index"
                    class="mb-2"
                  >
                    <v-chip
                      :color="result.success ? 'success' : 'error'"
                      size="small"
                      class="mr-2"
                    >
                      {{ result.success ? 'SUCCESS' : 'ERROR' }}
                    </v-chip>
                    <span class="text-body-2">{{ result.message }}</span>
                  </div>
                </v-card>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// Page meta
definePageMeta({
  title: 'Wallet Test',
  layout: 'default',
})

// Composable
const solana = useSolana()

// Local state
const signingMessage = ref(false)
const testResults = ref([])

// Computed
const storeState = computed(() => ({
  connected: solana.connected.value,
  connecting: solana.connecting.value,
  publicKey: solana.publicKey.value?.toString() || null,
  walletAddress: solana.walletAddress.value,
  truncatedAddress: solana.truncatedAddress.value,
  hasError: solana.hasError.value,
  error: solana.error.value,
  wallet: solana.wallet.value
    ? {
        name: solana.wallet.value.name,
        url: solana.wallet.value.url,
      }
    : null,
}))

// Methods
const testSignMessage = async () => {
  try {
    signingMessage.value = true
    const message = `Test message from GamaTrain at ${new Date().toISOString()}`

    const signature = await solana.signMessage(message)

    testResults.value.unshift({
      success: true,
      message: `Message signed successfully. Signature length: ${signature.length} bytes`,
      timestamp: new Date().toISOString(),
    })
  }
  catch (error) {
    testResults.value.unshift({
      success: false,
      message: `Sign message failed: ${error.message}`,
      timestamp: new Date().toISOString(),
    })
  }
  finally {
    signingMessage.value = false
  }
}

const refreshConnection = async () => {
  try {
    await solana.autoReconnect()
    testResults.value.unshift({
      success: true,
      message: 'Connection refresh completed',
      timestamp: new Date().toISOString(),
    })
  }
  catch (error) {
    testResults.value.unshift({
      success: false,
      message: `Connection refresh failed: ${error.message}`,
      timestamp: new Date().toISOString(),
    })
  }
}
</script>

<style scoped>
.wallet-test-page {
  min-height: 100vh;
  padding: 2rem 0;
}

.debug-info {
  font-size: 12px;
  line-height: 1.4;
  color: rgb(var(--v-theme-on-surface));
  background: transparent;
  white-space: pre-wrap;
  word-break: break-word;
}

.test-results {
  max-height: 300px;
  overflow-y: auto;
}
</style>
