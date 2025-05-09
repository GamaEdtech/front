import useCastleModel from "./useCastleModel"
import * as THREE from "three"
import { Ref } from "@vue/runtime-dom"
import { DoorModels } from "~/interfaces/DoorModels.interface"
import useChestModel from "./useChestModel"

const useModels = async (scene: Ref<THREE.Scene>, doorModels: DoorModels, modelesLoaded: Ref<boolean>) => {

    let visibleChest: (status: boolean) => void = () => { };
    let chestInteractions: (character: THREE.Object3D) => boolean = () => false;
    let chestAnimation: (() => { play: () => void, stop: () => void }) | null = null;
    // per-frame update callback for the chest animation mixer
    let chestUpdate: (delta: number) => void = () => { };

    await Promise.all(
        [useCastleModel(doorModels), useChestModel()]
    ).then((res) => {
        const [castle, chest] = res

        if (!castle) return
        if (!chest) return

        visibleChest = (status) => {
            status ? castle.add(chest.model) : castle.remove(chest.model)
        }
        chestInteractions = chest.chestInteractions
        chestAnimation = chest.animation
        // grab the chest-model's per-frame update callback
        chestUpdate = chest.update

        scene.value.add(castle)

        modelesLoaded.value = true
    })

    return {
        visibleChest,
        chestInteractions,
        chestAnimation,
        chestUpdate
    }
}

export default useModels