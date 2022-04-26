import EventEmitter from "./EventEmitter"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

export default class Resources extends EventEmitter {
    constructor(sources) {
        super()

        // Options
        this.sources = sources

        // Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders() {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
    }

    startLoading() {
        this.sources.forEach((source) => {
            if (source.type === "gltf") {
                this.loaders.gltfLoader.load(source.path, (gltf) => {
                    this.items[source.name] = gltf
                    this.loaded++
                    this.Loaded()
                })
            }
            if (source.type === "texture") {
                this.loaders.textureLoader.load(source.path, (texture) => {
                    this.items[source.name] = texture
                    this.loaded++
                    this.Loaded()
                })
            }
            if (source.type === "cubeTexture") {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (cubeTexture) => {
                        this.items[source.name] = cubeTexture
                        this.loaded++
                        this.Loaded()
                    }
                )
            }
        })
    }

    Loaded() {
        if (this.loaded === this.toLoad) {
            this.trigger("resourceLoaded")
        }
    }
}
