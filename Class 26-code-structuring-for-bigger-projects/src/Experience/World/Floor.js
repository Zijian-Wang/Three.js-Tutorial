import Experience from "../Experience"
import * as THREE from "three"

export default class Floor {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setTextures()
        this.setGeometry()
    }

    setTextures() {
        this.textures = {}
        this.textures.color = this.resources.items.grassColorTexture
        this.textures.normal = this.resources.items.grassNormalTexture
        this.textures.color.encoding = THREE.sRGBEncoding
        this.textures.color.repeat.set(5, 5)
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping
        this.textures.normal.encoding = THREE.sRGBEncoding
        this.textures.normal.repeat.set(5, 5)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping
    }

    setGeometry() {
        this.mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(20, 20, 64, 64),
            new THREE.MeshStandardMaterial({
                map: this.textures.color,
                normalMap: this.textures.normal,
                normalScale: new THREE.Vector2(0.5, 0.5),
                displacementMap: this.textures.normal,
                displacementScale: 0.5,
                displacementBias: 0,
                roughness: 0.8,
            })
        )
        this.mesh.rotation.x = -Math.PI / 2
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }
}
