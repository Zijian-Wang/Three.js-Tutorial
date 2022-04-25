import * as THREE from "three"
import Sizes from "./Utils/Sizes.js"
import Time from "./Utils/Time.js"
import Camera from "./Camera.js"
import Renderer from "./Renderer.js"

let instance = null

export default class Experience {
    constructor(canvas) {
        // single time instantiation
        if (instance) {
            return instance
        }

        instance = this

        // Global access
        window.experience = this

        // Setup
        this.canvas = canvas
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.renderer = new Renderer()

        // Resize trigger
        this.sizes.on("resize", () => {
            this.resize()
            // console.log(this.sizes.width)
        })

        // Time trigger
        this.time.on("tick", () => {
            this.update()
        })
    }

    resize() {
        this.camera.resize()
    }

    update() {
        // console.log("update")
        this.camera.update()
    }
}
