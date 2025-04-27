import modelesLoaded from "~/store/modelsLoaded"
import useCastleModel from "./useCastleModel"
import * as THREE from "three"
import { Ref } from "@vue/runtime-dom"

const useModels = (scene: Ref<THREE.Scene>) => {
    Promise.all(
        [useCastleModel(scene)]
    ).then(() => {
        modelesLoaded.value = true
    })
}

export default useModels