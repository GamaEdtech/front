import useCastleModel from "./useCastleModel"
import * as THREE from "three"
import { Ref } from "@vue/runtime-dom"
import { DoorModels } from "~/interfaces/DoorModels.interface"

const useModels = (scene: Ref<THREE.Scene>, doorModels: DoorModels, modelesLoaded: Ref<boolean>) => {
    Promise.all(
        [useCastleModel(scene, doorModels)]
    ).then(() => {
        modelesLoaded.value = true
    })
}

export default useModels