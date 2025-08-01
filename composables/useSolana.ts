// Flexible wallet adapter interface that matches Phantom's actual API
interface BaseWalletAdapter {
  connect(): Promise<void>
  disconnect(): Promise<void>
  signMessage(message: Uint8Array): Promise<Uint8Array>
  sendTransaction(transaction: unknown, connection?: unknown, options?: unknown): Promise<string>
  publicKey: { toString(): string } | null
  connected: boolean
}

interface WalletAdapterConstructor {
  new (): BaseWalletAdapter
}

interface WalletState {
  wallet: {
    name: string
    url: string
    icon: string
    adapter: WalletAdapterConstructor
  } | null
  adapter: BaseWalletAdapter | null
  publicKey: { toString(): string } | null
  connected: boolean
  connecting: boolean
  error: string | null
}

export const useSolana = () => {
  // Nuxt 3 reactive state
  const walletState = useState<WalletState>('solana-wallet', () => ({
    wallet: null,
    adapter: null,
    publicKey: null,
    connected: false,
    connecting: false,
    error: null,
  }))

  // Computed getters
  const isConnected = computed(() => walletState.value.connected)
  const isConnecting = computed(() => walletState.value.connecting)
  const walletAddress = computed(() => walletState.value.publicKey?.toString() || null)
  const truncatedAddress = computed(() => {
    if (!walletState.value.publicKey) return null
    const address = walletState.value.publicKey.toString()
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  })
  const hasError = computed(() => !!walletState.value.error)

  // Actions
  const getWallet = async () => {
    try {
      // Dynamic import to handle SSR
      if (import.meta.client) {
        const { PhantomWalletAdapter } = await import('@solana/wallet-adapter-phantom')

        walletState.value.wallet = {
          name: 'Phantom',
          url: 'https://phantom.app/',
          icon: 'https://www.phantom.app/img/phantom-logo.svg',
          adapter: PhantomWalletAdapter,
        }

        return walletState.value.wallet
      }
    }
    catch (error) {
      console.error('Error loading wallet:', error)
      walletState.value.error = 'Failed to load wallet adapter'
      throw error
    }
  }

  const connect = async () => {
    if (walletState.value.connecting || walletState.value.connected) return

    try {
      walletState.value.connecting = true
      walletState.value.error = null

      // Ensure wallet is loaded
      if (!walletState.value.wallet) {
        await getWallet()
      }

      // Check if Phantom is installed
      if (!window.solana || !window.solana.isPhantom) {
        walletState.value.error = 'Phantom wallet is not installed. Please install it from phantom.app'
        throw new Error('Phantom wallet not found')
      }

      // Create adapter instance
      const AdapterClass = walletState.value.wallet!.adapter
      walletState.value.adapter = new AdapterClass()

      // Connect to wallet
      await walletState.value.adapter.connect()

      walletState.value.publicKey = walletState.value.adapter.publicKey
      walletState.value.connected = true

      // Store connection state in localStorage
      if (import.meta.client) {
        localStorage.setItem('solana-wallet-connected', 'true')
        localStorage.setItem('solana-wallet-name', walletState.value.wallet!.name)
      }

      console.log('Wallet connected:', walletState.value.publicKey?.toString())
    }
    catch (error: unknown) {
      console.error('Connection error:', error)
      walletState.value.error = (error as Error).message || 'Failed to connect wallet'
      walletState.value.connected = false
      walletState.value.publicKey = null
      walletState.value.adapter = null
      throw error
    }
    finally {
      walletState.value.connecting = false
    }
  }

  const disconnect = async () => {
    try {
      if (walletState.value.adapter) {
        await walletState.value.adapter.disconnect()
      }

      walletState.value.adapter = null
      walletState.value.publicKey = null
      walletState.value.connected = false
      walletState.value.error = null

      // Clear localStorage
      if (import.meta.client) {
        localStorage.removeItem('solana-wallet-connected')
        localStorage.removeItem('solana-wallet-name')
      }

      console.log('Wallet disconnected')
    }
    catch (error: unknown) {
      console.error('Disconnect error:', error)
      walletState.value.error = (error as Error).message || 'Failed to disconnect wallet'
      throw error
    }
  }

  const signMessage = async (message: string) => {
    if (!walletState.value.adapter || !walletState.value.connected) {
      throw new Error('Wallet not connected')
    }

    try {
      const encodedMessage = new TextEncoder().encode(message)
      const signature = await walletState.value.adapter.signMessage(encodedMessage)
      return signature
    }
    catch (error: unknown) {
      console.error('Sign message error:', error)
      walletState.value.error = (error as Error).message || 'Failed to sign message'
      throw error
    }
  }

  const sendTransaction = async (transaction: unknown, connection: unknown, options?: unknown) => {
    if (!walletState.value.adapter || !walletState.value.connected) {
      throw new Error('Wallet not connected')
    }

    try {
      const signature = await walletState.value.adapter.sendTransaction(transaction, connection, options)
      return signature
    }
    catch (error: unknown) {
      console.error('Send transaction error:', error)
      walletState.value.error = (error as Error).message || 'Failed to send transaction'
      throw error
    }
  }

  const autoReconnect = async () => {
    if (import.meta.client && !walletState.value.connected) {
      const wasConnected = localStorage.getItem('solana-wallet-connected')
      const walletName = localStorage.getItem('solana-wallet-name')

      if (wasConnected === 'true' && walletName) {
        try {
          await connect()
        }
        catch (error: unknown) {
          console.log('Auto-reconnect failed:', (error as Error).message)
          // Clear stored connection state if auto-reconnect fails
          localStorage.removeItem('solana-wallet-connected')
          localStorage.removeItem('solana-wallet-name')
        }
      }
    }
  }

  const clearError = () => {
    walletState.value.error = null
  }

  // Return reactive state and methods
  return {
    // State
    wallet: readonly(computed(() => walletState.value.wallet)),
    adapter: readonly(computed(() => walletState.value.adapter)),
    publicKey: readonly(computed(() => walletState.value.publicKey)),
    connected: readonly(computed(() => walletState.value.connected)),
    connecting: readonly(computed(() => walletState.value.connecting)),
    error: readonly(computed(() => walletState.value.error)),

    // Computed getters
    isConnected,
    isConnecting,
    walletAddress,
    truncatedAddress,
    hasError,

    // Actions
    getWallet,
    connect,
    disconnect,
    signMessage,
    sendTransaction,
    autoReconnect,
    clearError,
  }
}
