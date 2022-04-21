import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "lil-gui"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Test sphere
 */
// const testSphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial()
// )
// scene.add(testSphere)

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse((node) => {
        if (node.material instanceof THREE.MeshStandardMaterial) {
            // console.log(node)
            node.material.envMap = environmentMap
            node.material.envMapIntensity = debugObject.envMapIntensity
            node.castShadow = true
            node.receiveShadow = true
        }
    })
}

/**
 * Env Maps
 */
const environmentMap = cubeTextureLoader.load([
    "textures/environmentMaps/2/px.jpg",
    "textures/environmentMaps/2/nx.jpg",
    "textures/environmentMaps/2/py.jpg",
    "textures/environmentMaps/2/ny.jpg",
    "textures/environmentMaps/2/pz.jpg",
    "textures/environmentMaps/2/nz.jpg",
])
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap
debugObject.envMapIntensity = 3
gui.add(debugObject, "envMapIntensity", 0, 10, 0.1).onChange(updateAllMaterials)

/**
 * Model
 */
gltfLoader.load("/models/hamburger.glb", (gltf) => {
    // console.log(gltf)
    const model = gltf.scene
    model.scale.set(0.5, 0.5, 0.5)
    model.position.set(0, -2.5, 0)
    model.rotation.y = 2.678
    scene.add(model)

    gui.add(model.rotation, "y", -Math.PI, Math.PI, 0.001).name(
        "Model Rotation"
    )

    updateAllMaterials()
})

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(0.25, 3, -2.25)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
// const lightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLight)

gui.add(directionalLight, "intensity", 0, 10, 0.001).name("Light Intensity")
gui.add(directionalLight.position, "x", -5, 5, 0.001).name("Light Position X")
gui.add(directionalLight.position, "y", -5, 5, 0.001).name("Light Position Y")
gui.add(directionalLight.position, "z", -5, 5, 0.001).name("Light Position Z")

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
)
camera.position.set(4, 1, -4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.25

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui.add(renderer, "toneMapping", {
    None: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
})
    .name("Tone Mapping")
    .onFinishChange(renderer.setToneMapping)

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
