import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { LoadingManager } from 'three'

/**
 * Texture
 */
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
// const doorColor = textureLoader.load('/textures/door/color.jpg')
const doorColor = textureLoader.load('textures/minecraft.png')
const doorAlpha = textureLoader.load('textures/door/alpha.jpg')
const doorAO = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorRoughness = textureLoader.load('textures/door/roughness.jpg')
const doorNormal = textureLoader.load('textures/door/normal.jpg')
const doorMetalness = textureLoader.load('textures/door/metalness.jpg')

// doorColor.repeat.x = 5
// doorColor.repeat.y = 5
doorColor.wrapS = THREE.RepeatWrapping
doorColor.wrapT = THREE.RepeatWrapping

// doorColor.offset.x = 5.5
// doorColor.rotation = Math.PI / 4
// doorColor.center.x = 0.5
// doorColor.center.y = 0.5

doorColor.generateMipmaps = false
doorColor.minFilter = THREE.NearestFilter
doorColor.magFilter = THREE.NearestFilter

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
    // alphaMap: doorAlpha, 
    // aoMap: doorAO,
    map: doorColor
    // normalMap(doorNormal)
    // matelnessMap(doorMetalness)
    // roughnessMap(doorRoughness)
})

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()