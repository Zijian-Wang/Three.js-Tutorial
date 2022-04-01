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
    count: 100000,
    size: 1,
    radius: 5,
    branches: 5,
    spin: 2,
    randomness: 0.3,
    randomnessPower: 3,
    insideColor: '#FFB74D',
    outsideColor: '#7C4DFF',
}

let geometry, material, points = null

const generateGalaxy = () => {
    // console.log('Generating galaxy...')

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
    const colors = new Float32Array(parameters.count * 3)
    const insideColor = new THREE.Color(parameters.insideColor)
    const outsideColor = new THREE.Color(parameters.outsideColor)
 
    for(let i = 0; i < parameters.count; i++)
    {
        const i3 = i * 3

        // Position
        const radius = Math.random() * parameters.radius
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        const spinAngle = radius * parameters.spin

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() > 0.5 ? 1 : -1) * parameters.randomness
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() > 0.5 ? 1 : -1) * parameters.randomness
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() > 0.5 ? 1 : -1) * parameters.randomness

        positions[i3 + 0] = Math.sin(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.cos(branchAngle + spinAngle) * radius + randomZ

        // Colors
        const lerpedColor = insideColor.clone().lerp(outsideColor, radius / parameters.radius)
        colors[i3 + 0] = lerpedColor.r
        colors[i3 + 1] = lerpedColor.g
        colors[i3 + 2] = lerpedColor.b
    }
 
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    /**
     * Material
     */
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
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
    .max(100000)
    .step(50)
    .onFinishChange(generateGalaxy)
gui
    .add(parameters, 'size')
    .min(0.01)
    .max(2)
    .step(0.001)
    .onFinishChange(generateGalaxy)
gui
    .add(parameters, 'radius')
    .min(5)
    .max(10)
    .step(0.01)
    .onFinishChange(generateGalaxy)
gui
    .add(parameters, 'branches')
    .min(2)
    .max(12)
    .step(1)
    .onFinishChange(generateGalaxy)
gui
    .add(parameters, 'spin')
    .min(-5)
    .max(5)
    .step(0.01)
    .onFinishChange(generateGalaxy)
gui
    .add(parameters, 'randomness')
    .min(0)
    .max(1)
    .step(0.001)
    .onFinishChange(generateGalaxy)
gui
    .add(parameters, 'randomnessPower')
    .min(1)
    .max(10)
    .step(0.001)
    .onFinishChange(generateGalaxy)
gui
    .addColor(parameters, 'insideColor')
    .onFinishChange(generateGalaxy)
gui
    .addColor(parameters, 'outsideColor')
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
camera.position.set(2, 5, 3)
camera.lookAt(scene.position)
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