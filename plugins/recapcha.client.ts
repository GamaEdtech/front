import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

export interface RecaptchaContext {
    render: (elementId: string, callback: (response: string) => void) => void
    execute: (action: string, callback: (token: string) => void) => void
}

declare module 'nuxt/app' {
    interface NuxtApp {
        $recaptcha: RecaptchaContext
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $recaptcha: RecaptchaContext
    }
}

export default defineNuxtPlugin((nuxtApp) => {
    // Only run on client side
    if (process.server) return

    // Get site key from runtime config or environment
    const siteKey: string = process.env.RECAPTCHA_SITE_KEY as string

    // Function to dynamically load the reCAPTCHA script
    function loadRecaptchaScript(): Promise<any> {
        return new Promise((resolve, reject) => {
            // Check if grecaptcha is already available
            if ((window as any).grecaptcha) {
                return resolve((window as any).grecaptcha)
            }

            // Check if the script is already present
            if (document.getElementById('recaptcha-script')) {
                // Wait for it to load
                const checkLoaded = () => {
                    if ((window as any).grecaptcha) {
                        resolve((window as any).grecaptcha)
                    } else {
                        setTimeout(checkLoaded, 100)
                    }
                }
                checkLoaded()
                return
            }

            // Create the script tag for reCAPTCHA with the site key
            const script: HTMLScriptElement = document.createElement('script')
            script.id = 'recaptcha-script'
            script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
            script.async = true
            script.defer = true

            script.onload = (): void => {
                // Wait a bit for grecaptcha to be available
                const checkReady = () => {
                    if ((window as any).grecaptcha && (window as any).grecaptcha.ready) {
                        (window as any).grecaptcha.ready(() => {
                            resolve((window as any).grecaptcha)
                        })
                    } else {
                        setTimeout(checkReady, 100)
                    }
                }
                checkReady()
            }

            script.onerror = (): void => reject(new Error('Failed to load reCAPTCHA script.'))

            document.head.appendChild(script)
        })
    }

    loadRecaptchaScript()
        .then((grecaptcha: any) => {
            console.log('reCAPTCHA script loaded successfully.')

            const recaptcha: RecaptchaContext = {
                render: (elementId: string, callback: (response: string) => void): void => {
                    grecaptcha.ready(() => {
                        try {
                            grecaptcha.render(elementId, {
                                sitekey: siteKey,
                                callback,
                            })
                        } catch (error) {
                            console.error('Error rendering reCAPTCHA:', error)
                        }
                    })
                },
                execute: (action: string, callback: (token: string) => void): void => {
                    grecaptcha.ready(() => {
                        try {
                            grecaptcha.execute(siteKey, { action }).then((token: string) => {
                                callback(token)
                            }).catch((error: any) => {
                                console.error('Error executing reCAPTCHA:', error)
                                throw error
                            })
                        } catch (error) {
                            console.error('Error in reCAPTCHA execute:', error)
                            throw error
                        }
                    })
                },
            }

            nuxtApp.provide('recaptcha', recaptcha)
        })
        .catch((error: Error) => {
            console.error('Error loading reCAPTCHA:', error)
        })
})