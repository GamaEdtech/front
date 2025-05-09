import { useThreeJS } from "../useThreejs";
import * as THREE from "three"


const useChestModel = async (): Promise<{
    model: THREE.Group<THREE.Object3DEventMap>,
    chestInteractions: (character: THREE.Object3D) => boolean,
    animation: () => { play: () => void, stop: () => void },
    update: (delta: number) => void,
    mixer: THREE.AnimationMixer | null
} | null> => {
    try {
        const { loadModel } = useThreeJS()
        const chestGlb = await loadModel('/game/castle/treasure_chest.glb')

        const chest = chestGlb.scene

        chest.position.set(-15.230, -0.130, -553.280)
        chest.rotation.set(0, 0, .002)
        chest.scale.set(25, 25, 25)

        const INTERACTION_DISTANCE = 80
        const chestPosition = new THREE.Vector3(-15.230, -0.130, -553.280);


        const chestInteractions = (character: THREE.Object3D): boolean => {

            const distanceToChest = character.position.distanceTo(chestPosition);

            if (distanceToChest < INTERACTION_DISTANCE) {
                return true
            }
            return false
        }

        let mixer: THREE.AnimationMixer | null = null;

        const update = (delta: number) => {
            if (mixer) mixer.update(delta)
        }

        const animation = (): { play: () => void, stop: () => void } => {
            if (!mixer) {
                mixer = new THREE.AnimationMixer(chest)
            }

            const action = mixer.clipAction(chestGlb.animations[0], chest)

            const play = () => {
                console.log("play");
                action.loop = 2200
                action.play()
            }

            const stop = () => {
                action.stop()
            }

            return { play, stop }
        }

        return {
            model: chest,
            chestInteractions,
            animation,
            update,
            mixer
        }
    }
    catch (error) {
        console.log(error);
        console.log("cant load model");
        return null
    }
}

export default useChestModel