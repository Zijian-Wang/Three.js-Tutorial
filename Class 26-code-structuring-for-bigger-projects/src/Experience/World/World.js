import Experience from "../Experience.js"
import Environment from "./Environment.js"
import * as THREE from "three"

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // test mesh
        const testMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({})
        )
        this.scene.add(testMesh)

        // Waite for resources to load
        this.resources.on("resourceLoaded", () => {
            // Setup
            this.environment = new Environment()
        })
    }
}
