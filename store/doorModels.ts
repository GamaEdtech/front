import { reactive } from "vue";
import * as THREE from 'three'
interface DoorModels {
    door001: {
        model: THREE.Object3D | null
    },
    door002: {
        model: THREE.Object3D | null
    },
    door003: {
        model: THREE.Object3D | null
    }
}

export const doorModels = reactive<DoorModels>({
    door001: {
        model: null,
    },
    door002: {
        model: null,
    },
    door003: {
        model: null,
    }
})
