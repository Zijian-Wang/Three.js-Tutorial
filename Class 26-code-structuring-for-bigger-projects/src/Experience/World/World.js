import Experience from "../Experience.js"
import Environment from "./Environment.js"
import Floor from "./Floor.js"
import Fox from "./Fox.js"
import * as THREE from "three"

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Waite for resources to load
        this.resources.on("resourceLoaded", () => {
            // Setup
            this.environment = new Environment()
            this.floor = new Floor()
            this.foxModel = new Fox()
        })
    }

    update() {
        if (this.foxModel) {
            // console.log("logged")
            this.foxModel.update()
        }
    }
}
