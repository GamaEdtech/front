import * as THREE from "three"
import Camera from "./Camera"
import Sizes from "./utils/Sizes"
import Time from "./utils/Time"
import Debug from "./utils/Debug"
import Renderer from "./Renderer"
import World from "./world/World"

let instance = null
export default class Experience {
    constructor(canvas) {
        if (instance) {
            return instance
        }

        instance = this


        // Global access
        window.experience = this

        // Options
        this.canvas = canvas

        this.options = {
            groundSize: 100,
            roadSize: 100,
            roadWidth: 10,
            roadAmplitudeX: 4.6,
            roadFrequencyX: 0.14,
            colorRoad: "#8a8a8a",
            widthLineArround: 0.034,
            widthLineSeperator: 0.02,
            countLine: 4,
            colorLineSeperator: "#fff480",
            colorLineArround: "#bababa"
        }


        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.world = new World()
        this.camera = new Camera()
        this.renderer = new Renderer()


        // axes helper
        const axesHelper = new THREE.AxesHelper(5)
        this.scene.add(axesHelper)


        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })


    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.debug.update()
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')
        instance = null

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                // Loop through the material properties
                for (const key in child.material) {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })

        // this.camera.controls.dispose()
        this.renderer.instance.dispose()

    }
}