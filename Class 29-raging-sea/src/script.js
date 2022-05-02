import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "lil-gui"
import vertexMat from "./shaders/water/vertex.glsl"
import fragmentMat from "./shaders/water/fragment.glsl"

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {
    depthColor: new THREE.Color("#0c115a"),
    surfaceColor: new THREE.Color("#94eaff"),
}

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexMat,
    fragmentShader: fragmentMat,
    uniforms: {
        uTime: { value: 0.0 },
        uSpeed: { value: 1.0 },

        uBigWaveElevation: { value: 0.2 },
        uBigWaveFrequency: { value: new THREE.Vector2(4, 1.5) },

        uDepthColor: { value: debugObject.depthColor },
        uSurfaceColor: { value: debugObject.surfaceColor },
        uColorOffset: { value: 0.3 },
        uColorMultiplier: { value: 2.3 },
    },
})

// Add wave speed control to debug gui
gui.add(waterMaterial.uniforms.uSpeed, "value", 0.1, 15.0, 0.1).name(
    "Wave Speed"
)
//  Add wave elevation control to debug gui
gui.add(
    waterMaterial.uniforms.uBigWaveElevation,
    "value",
    0.001,
    0.5,
    0.001
).name("Wave Height")
//  Add wave frequency control to debug gui
gui.add(waterMaterial.uniforms.uBigWaveFrequency.value, "x", 0, 50, 0.01).name(
    "Wave Frequency X"
)
gui.add(waterMaterial.uniforms.uBigWaveFrequency.value, "y", 0, 50, 0.01).name(
    "Wave Frequency Z"
)
// Add wave Colors to debug gui
gui.addColor(debugObject, "depthColor")
    .name("Dark Color")
    .onChange(() => {
        waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
    })
gui.addColor(debugObject, "surfaceColor")
    .name("Light Color")
    .onChange(() => {
        waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
    })
// Add Color Offset to debug gui
gui.add(waterMaterial.uniforms.uColorOffset, "value", 0, 1, 0.001).name(
    "Offset Colors"
)
gui.add(waterMaterial.uniforms.uColorMultiplier, "value", 0.1, 5, 0.001).name(
    "Multiply Colors"
)

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = -Math.PI * 0.5
scene.add(water)

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
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.4

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update Shader time
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
