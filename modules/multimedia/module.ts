import { defineNuxtModule } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { resolve } from 'pathe'

export default defineNuxtModule({
    meta: {
        name: 'multimedia-module',
        configKey: 'multimedia-module',
    },

    setup(options: any, nuxt: Nuxt) {
        nuxt.hook('pages:extend', (pages) => {
            pages.push(
                {
                    name: 'multimedia-detail',
                    path: '/multimedia/:id/:slug',
                    file: resolve(__dirname, './pages/detail.vue')
                }
            )
        })
    }
})
