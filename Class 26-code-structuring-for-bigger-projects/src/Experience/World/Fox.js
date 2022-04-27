import Experience from "../Experience"
import Debug from "../Utils/Debug"
import * as THREE from "three"

export default class Fox {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resource = this.experience.resources.items.foxModel

        // Debug
        if (this.experience.debug) {
            // console.log(this.experience.debug)
            this.debugFolder =
                this.experience.debug.ui.addFolder("Fox Animation")
        }

        // console.log(this.resource)
        this.setGeometry()
        this.setAnimations()
    }

    setGeometry() {
        this.gltf = this.resource.scene
        this.gltf.scale.set(0.03, 0.03, 0.03)
        this.gltf.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
            }
        })
        this.scene.add(this.gltf)
    }

    setAnimations() {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.gltf)
        this.animation.clips = {}
        this.animation.clips.idle = this.animation.mixer.clipAction(
            this.resource.animations[0]
        )
        this.animation.clips.walk = this.animation.mixer.clipAction(
            this.resource.animations[1]
        )
        this.animation.clips.run = this.animation.mixer.clipAction(
            this.resource.animations[2]
        )

        this.animation.clips.current = this.animation.clips.idle
        this.animation.clips.current.play()

        this.animation.clips.play = (name) => {
            const newAction = this.animation.clips[name]
            const oldAction = this.animation.clips.current

            if (newAction !== oldAction) {
                newAction.reset()
                newAction.play()
                newAction.crossFadeFrom(oldAction, 1, true)

                this.animation.clips.current = newAction
            }
        }

        // Debug
        if (this.experience.debug) {
            const debugObject = {
                idle: () => {
                    this.animation.clips.play("idle")
                },
                walk: () => {
                    this.animation.clips.play("walk")
                },
                run: () => {
                    this.animation.clips.play("run")
                },
            }
            // console.log(this.debugFolder)
            this.debugFolder.add(debugObject, "idle")
            this.debugFolder.add(debugObject, "walk")
            this.debugFolder.add(debugObject, "run")
        }
    }

    update() {
        this.animation.mixer.update(this.experience.time.delta / 1000)
        // console.log(this.experience.time.elapsed)
    }
}
