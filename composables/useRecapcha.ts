import { useNuxtApp } from "nuxt/app"
import type { RecaptchaContext } from '~/plugins/recapcha.client'

export const useRecaptcha = () => {
    const { $recaptcha } = useNuxtApp()

    const getToken = async (action: string = 'submit'): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (process.server) {
                reject(new Error('reCAPTCHA can only be used on client side'))
                return
            }

            if (!$recaptcha) {
                reject(new Error('reCAPTCHA not loaded'))
                return
            }

            try {
                ($recaptcha as RecaptchaContext).execute(action, (token: string) => {
                    resolve(token)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    const isLoaded = (): boolean => {
        return (process.client && !!$recaptcha) as boolean
    }

    return {
        getToken,
        isLoaded
    }
}