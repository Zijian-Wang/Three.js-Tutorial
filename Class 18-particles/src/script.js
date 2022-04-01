import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { ParametricGeometry } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(1))

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Galaxy
 */
const parameters = {
    count: 3000,
    size: 10,
}

let geometry, material, points = null

const generateGalaxy = () => {
    console.log('Generating galaxy...')

    // dispose the old system if it exists
    try {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    } catch (error){
        // console.log('No galaxy to dispose')
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
 
    for(let i = 0; i < parameters.count; i++)
    {
        const i3 = i * 3

        positions[i3    ] = (Math.random() - 0.5) * 3
        positions[i3 + 1] = (Math.random() - 0.5) * 3
        positions[i3 + 2] = (Math.random() - 0.5) * 3
    }
 
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    /**
     * Material
     */
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
    
}

generateGalaxy()

gui
    .add(parameters, 'count')
    .min(0)
    .max(1000)
    .step(50)
    .onFinishChange(generateGalaxy)
gui
    .add(parameters, 'size')
    .min(0.1)
    .max(50)
    .step(0.1)
    .onFinishChange(generateGalaxy)

// Test Cube
// const cube = new THREE.BoxGeometry(1, 1, 1)
// const cubemat = new THREE.MeshBasicMaterial({color: 0xffffff})
// scene.add(new THREE.Mesh(cube, cubemat))

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
camera.position.z = 3
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