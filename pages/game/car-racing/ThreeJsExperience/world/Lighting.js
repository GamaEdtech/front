import * as THREE from "three"
import Experience from '../Experience.js'


export default class Lighting {
    constructor() {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.options = this.experience.options


        this.setDirectioanlLight()
        this.setDebug()
    }

    setDirectioanlLight() {
        this.directionalLight = new THREE.DirectionalLight('#ffffff', 5)
        this.directionalLight.position.set(200, 210, -100)
        this.directionalLight.castShadow = true
        this.directionalLight.shadow.mapSize.set(1024, 1024)
        this.directionalLight.shadow.camera.near = 0.1
        this.directionalLight.shadow.camera.far = 30
        this.directionalLight.shadow.camera.top = 8
        this.directionalLight.shadow.camera.right = 8
        this.directionalLight.shadow.camera.bottom = -8
        this.directionalLight.shadow.camera.left = -8
        this.scene.add(this.directionalLight)
        this.helper = new THREE.DirectionalLightHelper(this.directionalLight, 5);
        this.scene.add(this.helper);
    }

    update() {
    }
    setDebug() {
        const LightFolder = this.debug.ui.addFolder("Ligh")
        LightFolder.add(this.directionalLight.position, "x").min(-100).max(200).step(1).name("x light")
        LightFolder.add(this.directionalLight.position, "y").min(-100).max(400).step(1).name("y light")
        LightFolder.add(this.directionalLight.position, "z").min(-100).max(200).step(1).name("z light")
    }
}