import * as THREE from "three"
import Sizes from "./Utils/Sizes.js"
import Time from "./Utils/Time.js"
import Camera from "./Camera.js"
import Renderer from "./Renderer.js"
import World from "./World/World.js"
import Resources from "./Utils/Resources.js"
import Debug from "./Utils/Debug.js"
import Sources from "./Sources.js"

let instance = null

export default class Experience {
    constructor(canvas) {
        // single time instantiation·
        if (instance) {
            return instance
        }

        instance = this

        // Global access
        window.experience = this

        // Debug
        this.debug = new Debug()

        // Setup
        this.canvas = canvas
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(Sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

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
        this.renderer.resize()
    }

    update() {
        // console.log("update")
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    dispose() {
        this.sizes.off("resize")
        this.time.off("tick")

        this.scene.traverse((object) => {
            // console.log(object)
            if (typeof object.dispose === "function") {
                object.dispose()
            }
            console.log(object)
        })

        if (this.debug.active) {
            this.debug.ui.destroy()
        }

        this.canvas.remove()
    }
}
