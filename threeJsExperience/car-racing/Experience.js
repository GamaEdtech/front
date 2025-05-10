import { Scene, Mesh } from "three"
import Camera from "./Camera"
import Sizes from "../utils/Sizes"
import Time from "../utils/Time"
import Renderer from "./Renderer"
import World from "./world/World"
import Resources from "../utils/Resources"

import sources from "./sources"


let instance = null
export default class Experience {
    constructor(canvas, questions, callBacks) {
        if (instance) {
            return instance
        }

        instance = this



        // Global access
        window.experience = this

        // Options
        this.canvas = canvas
        this.callBacks = callBacks
        this.isPlayingGame = false

        this.options = {
            // rendered
            clearColor: "#8ec3fb",
            // clearColor: "#112131",

            // fog
            fogColor: "#8ec3fb",
            // fogColor: "#112131",
            near: 20,
            far: 60,

            //ground
            groundSize: 200,
            groundWidth: 30,
            groundColor: "#85d534",
            // groundColor: "#548722",

            //road
            roadSize: 200,
            roadWidth: 10,
            roadAmplitudeX: 4.6,
            roadFrequencyX: 0.14,
            colorRoad: "#8a8a8a",
            // colorRoad: "#4b4949",
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
            colorWaterDeep: "#02587e",
            colorWaterSurface: "#83b7fb",
            colorSand: "#f8d559",
            colorGrass: "#85d534",
            colorSnow: "#ffffff",
            colorRock: "#613400",

            // colorWaterDeep: "#011c28",
            // colorWaterSurface: "#4c6b94",
            // colorSand: "#f8d559",
            // colorGrass: "#548722",
            // colorSnow: "#a3c6ff",
            // colorRock: "#1f1000",


            // tree
            treeCount: 30,

            // cloud
            cloudCount: 50,


            // car
            carBaseSpeed: 3,
            offsetXStart: 15,
            laneLerpSpeed: 3,
            distanceCameraFromCar: window.innerWidth < 480 ? 12 : 7,
            cameraYPosition: window.innerWidth < 480 ? 3 : 2,
            distanceLookAtCamera: window.innerWidth < 480 ? 13 : 5,
            reverseDistanceWrongAnswer: 15,
            reverseSpeedWrongAnswer: 0.5,
            reverseRotationSpeedWrongAnswer: Math.PI / 20,
            jumpHeightCorrectAnswer: 1,
            jumpDurationCorrectAnswer: 80, // frame per second


            // levels questions
            questions: questions,
            distanceFromEndRoadQuestion: 40,

            // gems
            gemCount: 3,
            gemsInformation: [],

            isDevelopeMent: false
        }

        this.options.questionsPositionX = this.options.questions.map((q, index) => {
            return ((this.options.roadSize - this.options.distanceFromEndRoadQuestion) / (this.options.questions.length + 1)) * (index + 1)
        })
        this.options.spacingFromEechItem = (this.options.questionsPositionX[1] - this.options.questionsPositionX[0]) / 3
        this.options.stepXSearchAvailablePlace = 2
        for (let i = 0; i < this.options.gemCount; i++) {
            const availableXs = this.generateAvailableGemXs()
            if (availableXs.length === 0) {
                console.warn("No valid X positions found for placing a gem.")
            }
            const randomIndex = Math.floor(Math.random() * availableXs.length)
            const x = Math.round(availableXs[randomIndex])
            const lane = Math.floor(Math.random() * this.options.countLine) + 1
            this.options.gemsInformation.push({ x, lane, collected: false })
        }
        this.options.gemsInformation.sort((a, b) => a.x - b.x)


        // Setup
        if (this.options.isDevelopeMent) {
            import('../utils/Debug').then(({ default: Debug }) => {
                this.debug = new Debug()
            })
        }
        this.sizes = new Sizes()
        this.time = new Time()
        this.resources = new Resources(sources)
        this.scene = new Scene()


        // axes helper
        // const axesHelper = new THREE.AxesHelper(5)
        // this.scene.add(axesHelper)


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

            if (this.debug) {
                this.debug.update()
            }
            if (this.world && this.camera && this.renderer) {
                this.camera.update()
                this.renderer.update()
                this.world.update()
            }
            this.callBacks.onChangeSceneReady()
        })
    }

    generateAvailableGemXs() {
        const availableXs = []

        const firstQuestionX = Math.min(...this.options.questionsPositionX)
        const lastQuestionX = Math.max(...this.options.questionsPositionX)

        const roadStart = firstQuestionX + this.options.spacingFromEechItem
        const roadEnd = lastQuestionX - this.options.spacingFromEechItem

        for (let x = roadStart; x <= roadEnd; x += this.options.stepXSearchAvailablePlace) {
            const isFarFromQuestions = this.options.questionsPositionX.every(qx => Math.abs(qx - x) > this.options.spacingFromEechItem)
            const isFarFromPrevious = this.options.gemsInformation.every(gem => Math.abs(gem.x - x) > this.options.spacingFromEechItem)
            if (isFarFromQuestions && isFarFromPrevious) {
                availableXs.push(x)
            }
        }

        return availableXs
    }

    changeLane(direction) {
        if (this.world && this.world.car) {
            this.world.car.changeLane(direction)
        }
    }

    setPlayingStatus(statusGame) {
        this.isPlayingGame = statusGame
    }

    changeCameraMode(mode) {
        this.camera.cameraMode = mode
    }

    resetGame() {
        if (this.world && this.world.car && this.world.gems) {
            this.options.gemsInformation = []
            for (let i = 0; i < this.options.gemCount; i++) {
                const availableXs = this.generateAvailableGemXs()
                if (availableXs.length === 0) {
                    console.warn("No valid X positions found for placing a gem.")
                }
                const randomIndex = Math.floor(Math.random() * availableXs.length)
                const x = Math.round(availableXs[randomIndex])
                const lane = Math.floor(Math.random() * this.options.countLine) + 1
                this.options.gemsInformation.push({ x, lane, collected: false })
            }
            this.options.gemsInformation.sort((a, b) => a.x - b.x)
            this.world.car.reset()
            this.world.gems.reset()
        }
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()

        // this.camera.update()
        // this.renderer.update()
        // this.world.update()
    }

    update() {
        if (this.isPlayingGame) {
            this.callBacks.onTimerUpdate(this.time.delta / 1000)
            if (this.debug) {
                this.debug.update()
            }
            if (this.world && this.camera && this.renderer) {
                this.camera.update()
                this.renderer.update()
                this.world.update()
            }
        } else {
            if (this.renderer) {
                this.renderer.update()
            }
        }
    }

    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')
        instance = null

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if (child instanceof Mesh) {
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