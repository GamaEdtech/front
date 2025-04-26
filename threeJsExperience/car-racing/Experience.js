import * as THREE from "three"
import Camera from "./Camera"
import Sizes from "../utils/Sizes"
import Time from "../utils/Time"
import Debug from "../utils/Debug"
import Renderer from "./Renderer"
import World from "./world/World"
import Resources from "../utils/Resources"

import sources from "./sources"


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
            // rendered
            // clearColor: "#8ec3fb",
            clearColor: "#112131",

            // fog
            // fogColor: "#8ec3fb",
            fogColor: "#112131",
            near: 20,
            far: 60,

            //ground
            groundSize: 200,
            groundWidth: 30,
            // groundColor: "#85d534",
            groundColor: "#548722",

            //road
            roadSize: 200,
            roadWidth: 10,
            roadAmplitudeX: 4.6,
            roadFrequencyX: 0.14,
            // colorRoad: "#8a8a8a",
            colorRoad: "#4b4949",
            widthLineArround: 0.034,
            widthLineSeperator: 0.02,
            countLine: 4,
            colorLineSeperator: "#fff480",
            colorLineArround: "#bababa",
            // mountain
            mountainSize: 200,
            mountainWidth: 30,
            // positionFrequency: 0.041,
            // strength: 36,
            positionFrequency: 0.017,
            strength: 70,
            warpFrequency: 0,
            warpStrength: 0,
            // colorWaterDeep: "#02587e",
            // colorWaterSurface: "#83b7fb",
            // colorSand: "#f8d559",
            // colorGrass: "#85d534",
            // colorSnow: "#ffffff",
            // colorRock: "#613400",
            colorWaterDeep: "#011c28",
            colorWaterSurface: "#4c6b94",
            colorSand: "#f8d559",
            colorGrass: "#548722",
            colorSnow: "#a3c6ff",
            colorRock: "#1f1000",


            // tree
            treeCount: 30,

            // cloud
            cloudCount: 50,


            // car
            carBaseSpeed: 2,
            offsetXStart: 15,
            laneLerpSpeed: 3,
            distanceCameraFromCar: 7,
            cameraYPosition: 2,


            // levels questions
            questions: [
                {
                    question: "10 - 2 =",
                    choices: ["4", "22", "45", "8"],
                    indexAnswer: 3
                },
                {
                    question: "22 * 2 =",
                    choices: ["4", "44", "81", "95"],
                    indexAnswer: 1
                },
                {
                    question: "1 + 1 =",
                    choices: ["2", "15", "56", "64"],
                    indexAnswer: 0
                },
                {
                    question: "9 * 8 =",
                    choices: ["21", "35", "72", "64"],
                    indexAnswer: 2
                },
            ]
        }


        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.resources = new Resources(sources)
        this.scene = new THREE.Scene()
        // this.camera = new Camera()
        // this.renderer = new Renderer()


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


        // Wait for resources
        this.resources.on('ready', () => {
            this.world = new World()
            this.camera = new Camera()
            this.renderer = new Renderer()
        })

        if (sources.length == 0) {
            this.world = new World()
        }


    }

    changeLane(direction) {
        if (this.world && this.world.car) {
            this.world.car.changeLane(direction)
        }
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.debug.update()
        if (this.world && this.camera && this.renderer) {
            this.camera.update()
            this.renderer.update()
            this.world.update()
        }
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