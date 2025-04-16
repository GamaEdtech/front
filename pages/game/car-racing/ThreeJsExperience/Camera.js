import * as THREE from 'three'
import Experience from './Experience.js'
// import { OrbitControls } from 'three/addons/controls/OrbitControls';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
// const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls.js').default;


export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.options = this.experience.options

        this.positionY = 2
        this.positionX = this.options.roadSize

        window.addEventListener("keydown", (event) => {
            if (event.key == "ArrowUp") {
                this.positionX -= 0.1
                const z = this.calculatePositionZ(this.positionX);
                this.instance.position.set(this.positionX, this.positionY, z)
            } else if (event.key == "ArrowDown") {
                this.positionX += 0.1
                const z = this.calculatePositionZ(this.positionX);
                this.instance.position.set(this.positionX, this.positionY, z)
            }
        })

        this.setInstance()
        this.setControls()
        this.setDebug()
    }

    calculatePositionZ(positionx) {
        const z = Math.cos(positionx * this.options.roadFrequencyX) * this.options.roadAmplitudeX + this.options.mountainWidth + ((this.options.groundWidth) / 2);
        return z
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000)

        // this.instance.position.set(100, 100, 100)

        const z = this.calculatePositionZ(this.positionX);
        this.instance.position.set(this.positionX, this.positionY, z)

        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }


    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    setDebug() {
        const CameraFolder = this.debug.ui.addFolder("Camera")
        CameraFolder.add(this.instance.position, "x").name("x Camera").min(-100).max(200).step(1)
        CameraFolder.add(this.instance.position, "y").name("y Camera").min(-100).max(200).step(1)
        CameraFolder.add(this.instance.position, "z").name("z Camera").min(-100).max(200).step(1)

    }


    update() {
        this.controls.update()


        const z = this.calculatePositionZ(this.positionX - 5);
        this.instance.lookAt(this.positionX - 5, this.positionY, z)

        this.instance.updateProjectionMatrix();
    }
}