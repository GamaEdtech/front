import { defineStore } from 'pinia'

export const useSolanaStore = defineStore('solana', {
  state: () => ({
    wallet: null,
    adapter: null,
    publicKey: null,
    connected: false,
    connecting: false,
    error: null,
  }),

  getters: {
    isConnected: state => state.connected,
    isConnecting: state => state.connecting,
    walletAddress: state => state.publicKey?.toString() || null,
    truncatedAddress: (state) => {
      if (!state.publicKey) return null
      const address = state.publicKey.toString()
      return `${address.slice(0, 4)}...${address.slice(-4)}`
    },
    hasError: state => !!state.error,
  },

  actions: {
    async getWallet() {
      try {
        // Dynamic import to handle SSR
        if (import.meta.client) {
          const { PhantomWalletAdapter } = await import('@solana/wallet-adapter-phantom')

          this.wallet = {
            name: 'Phantom',
            url: 'https://phantom.app/',
            icon: 'https://www.phantom.app/img/phantom-logo.svg',
            adapter: PhantomWalletAdapter,
          }

          return this.wallet
        }
      }
      catch (error) {
        console.error('Error loading wallet:', error)
        this.error = 'Failed to load wallet adapter'
        throw error
      }
    },

    async connect() {
      if (this.connecting || this.connected) return

      try {
        this.connecting = true
        this.error = null

        // Ensure wallet is loaded
        if (!this.wallet) {
          await this.getWallet()
        }

        // Check if Phantom is installed
        if (!window.solana || !window.solana.isPhantom) {
          this.error = 'Phantom wallet is not installed. Please install it from phantom.app'
          throw new Error('Phantom wallet not found')
        }

        // Create adapter instance
        const AdapterClass = this.wallet.adapter
        this.adapter = new AdapterClass()

        // Connect to wallet
        await this.adapter.connect()

        this.publicKey = this.adapter.publicKey
        this.connected = true

        // Store connection state in localStorage
        if (import.meta.client) {
          localStorage.setItem('solana-wallet-connected', 'true')
          localStorage.setItem('solana-wallet-name', this.wallet.name)
        }

        console.log('Wallet connected:', this.publicKey.toString())
      }
      catch (error) {
        console.error('Connection error:', error)
        this.error = error.message || 'Failed to connect wallet'
        this.connected = false
        this.publicKey = null
        this.adapter = null
        throw error
      }
      finally {
        this.connecting = false
      }
    },

    async disconnect() {
      try {
        if (this.adapter) {
          await this.adapter.disconnect()
        }

        this.adapter = null
        this.publicKey = null
        this.connected = false
        this.error = null

        // Clear localStorage
        if (import.meta.client) {
          localStorage.removeItem('solana-wallet-connected')
          localStorage.removeItem('solana-wallet-name')
        }

        console.log('Wallet disconnected')
      }
      catch (error) {
        console.error('Disconnect error:', error)
        this.error = error.message || 'Failed to disconnect wallet'
        throw error
      }
    },

    async signMessage(message) {
      if (!this.adapter || !this.connected) {
        throw new Error('Wallet not connected')
      }

      try {
        const encodedMessage = new TextEncoder().encode(message)
        const signature = await this.adapter.signMessage(encodedMessage)
        return signature
      }
      catch (error) {
        console.error('Sign message error:', error)
        this.error = error.message || 'Failed to sign message'
        throw error
      }
    },

    async sendTransaction(transaction) {
      if (!this.adapter || !this.connected) {
        throw new Error('Wallet not connected')
      }

      try {
        const signature = await this.adapter.sendTransaction(transaction)
        return signature
      }
      catch (error) {
        console.error('Send transaction error:', error)
        this.error = error.message || 'Failed to send transaction'
        throw error
      }
    },

    async autoReconnect() {
      if (import.meta.client && !this.connected) {
        const wasConnected = localStorage.getItem('solana-wallet-connected')
        const walletName = localStorage.getItem('solana-wallet-name')

        if (wasConnected === 'true' && walletName) {
          try {
            await this.connect()
          }
          catch (error) {
            console.log('Auto-reconnect failed:', error.message)
            // Clear stored connection state if auto-reconnect fails
            localStorage.removeItem('solana-wallet-connected')
            localStorage.removeItem('solana-wallet-name')
          }
        }
      }
    },

    clearError() {
      this.error = null
    },
  },
})
