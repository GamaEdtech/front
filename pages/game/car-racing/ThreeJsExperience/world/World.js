import * as THREE from "three"
import Experience from '../Experience.js'
import Ground from './Ground.js'
import Road from "./Road.js"

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time


        this.ground = new Ground()
        this.road = new Road()
    }


    update() {
    }
}