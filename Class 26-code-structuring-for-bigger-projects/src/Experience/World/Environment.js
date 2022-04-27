import * as THREE from "three"
import Experience from "../Experience.js"

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        if (this.experience.debug.active) {
            this.debugui = this.experience.debug.ui.addFolder("Environment")
        }

        this.setSunLight()
        this.setEnvMap()
    }

    setSunLight() {
        this.sunLight = new THREE.DirectionalLight("#ffffff", 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, -1.25)
        this.scene.add(this.sunLight)

        // debug
        if (this.experience.debug.active) {
            this.debugui
                .add(this.sunLight, "intensity", 0, 10, 0.1)
                .name("Sun Light Intensity")
        }
    }

    setEnvMap() {
        this.enviromentMap = {}
        this.enviromentMap.intensity = 1

        this.enviromentMap.texture = this.resources.items.environmentMapTexture
        this.enviromentMap.encoding = THREE.sRGBEncoding

        this.scene.environment = this.enviromentMap.texture
        // this.scene.background = this.enviromentMap.texture

        this.enviromentMap.updateMaterial = () => {
            this.scene.traverse((child) => {
                // console.log(child)
                if (
                    child instanceof THREE.Mesh &&
                    child.material instanceof THREE.MeshStandardMaterial
                ) {
                    child.material.envMap = this.enviromentMap.texture
                    child.material.envMapIntensity =
                        this.enviromentMap.intensity
                    child.material.envMap.mapping = THREE.CubeReflectionMapping
                    child.material.envMap.encoding = this.enviromentMap.encoding
                }
            })
        }

        this.enviromentMap.updateMaterial()

        // debug
        if (this.experience.debug.active) {
            this.debugui
                .add(this.enviromentMap, "intensity", 0, 2, 0.01)
                .name("EnvMap Intensity")
                .onChange(this.enviromentMap.updateMaterial)
        }
    }
}
