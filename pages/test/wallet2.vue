<script lang="ts" setup>
// Page meta
definePageMeta({
  title: 'Solana Wallets Vue Test',
  layout: 'default',
})

// Client-side only imports and wallet logic
const wallet = ref(null)
const testResults = ref<Array<{ success: boolean, message: string, timestamp: string }>>([])
const signingMessage = ref(false)

// Initialize wallet on client side only
onMounted(async () => {
  if (import.meta.client) {
    const { useWallet } = await import('solana-wallets-vue')
    wallet.value = useWallet()
  }
})

// Dynamic component import for WalletMultiButton
const WalletMultiButton = defineAsyncComponent(async () => {
  if (import.meta.client) {
    const { WalletMultiButton } = await import('solana-wallets-vue')
    return WalletMultiButton
  }
  return { template: '<div>Loading...</div>' }
})

// Computed properties
const isConnected = computed(() => wallet.value?.connected?.value || false)
const publicKey = computed(() => wallet.value?.publicKey?.value || null)
const signMessage = computed(() => wallet.value?.signMessage?.value || null)
const sendTransaction = computed(() => wallet.value?.sendTransaction || null)

// Computed wallet info
const walletInfo = computed(() => ({
  connected: isConnected.value,
  publicKey: publicKey.value?.toString() || null,
  truncatedAddress: publicKey.value
    ? `${publicKey.value.toString().slice(0, 4)}...${publicKey.value.toString().slice(-4)}`
    : null,
}))

// Test methods
const testSignMessage = async () => {
  if (!signMessage.value) {
    testResults.value.unshift({
      success: false,
      message: 'Sign message not supported by this wallet',
      timestamp: new Date().toISOString(),
    })
    return
  }

  try {
    signingMessage.value = true
    const message = `Test message from GamaTrain at ${new Date().toISOString()}`
    const encodedMessage = new TextEncoder().encode(message)

    const signature = await signMessage.value(encodedMessage)

    testResults.value.unshift({
      success: true,
      message: `Message signed successfully. Signature length: ${signature.length} bytes`,
      timestamp: new Date().toISOString(),
    })
  }
  catch (error: unknown) {
    testResults.value.unshift({
      success: false,
      message: `Sign message failed: ${(error as Error).message}`,
      timestamp: new Date().toISOString(),
    })
  }
  finally {
    signingMessage.value = false
  }
}

const sendTestTransaction = async () => {
  if (!publicKey.value || !sendTransaction.value) return

  try {
    const { Connection, clusterApiUrl, Keypair, SystemProgram, Transaction } = await import('@solana/web3.js')
    const connection = new Connection(clusterApiUrl('devnet'))

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey.value,
        toPubkey: Keypair.generate().publicKey,
        lamports: 1,
      }),
    )

    const signature = await sendTransaction.value(transaction, connection)
    await connection.confirmTransaction(signature, 'processed')

    testResults.value.unshift({
      success: true,
      message: `Transaction sent successfully. Signature: ${signature}`,
      timestamp: new Date().toISOString(),
    })
  }
  catch (error: unknown) {
    testResults.value.unshift({
      success: false,
      message: `Transaction failed: ${(error as Error).message}`,
      timestamp: new Date().toISOString(),
    })
  }
}
</script>

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
              Solana Wallets Vue Test
            </v-card-title>

            <v-card-text>
              <p class="text-body-1 mb-4">
                This page tests the official Solana Wallets Vue plugin with multiple wallet support.
              </p>

              <!-- Wallet Connection -->
              <div class="wallet-section mb-6">
                <h3 class="text-h6 mb-3">
                  Wallet Connection
                </h3>
                <ClientOnly>
                  <WalletMultiButton />
                </ClientOnly>
              </div>

              <!-- Wallet Info -->
              <div class="wallet-info-section mb-6">
                <h3 class="text-h6 mb-3">
                  Wallet Information
                </h3>
                <v-card
                  variant="outlined"
                  class="pa-4"
                >
                  <pre class="debug-info">{{ walletInfo }}</pre>
                </v-card>
              </div>

              <!-- Test Actions -->
              <div
                v-if="isConnected"
                class="test-actions mb-6"
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
                      @click="sendTestTransaction"
                    >
                      Send Test Transaction
                    </v-btn>
                  </v-col>
                </v-row>
              </div>

              <!-- Test Results -->
              <div
                v-if="testResults.length > 0"
                class="test-results"
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
