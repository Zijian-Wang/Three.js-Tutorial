import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Texture loader
 */
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#1044e0',
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor)
        particleMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Meshes
 */
const material = new THREE.MeshToonMaterial({ 
    color: parameters.materialColor,
    gradientMap: gradientTexture,
})

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
    )
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 64, 12),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)
const objectsDistance = 10

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

mesh1.position.x = 1
mesh2.position.x = -1
mesh3.position.x = 1

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Particles
 */
const particleCount = 500
const particleSize = 10
const particlePosition = new Float32Array(particleCount * 3)

for( let i = 0, i3 = 0; i < particleCount; i ++, i3 += 3 ) {
    particlePosition[i3 + 0] = (Math.random() * 2 - 1) * 5
    particlePosition[i3 + 1] = objectsDistance * 0.5 - (Math.random()) * objectsDistance * sectionMeshes.length
    particlePosition[i3 + 2] = (Math.random() * 2 - 1) * 7
}
const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(particlePosition, 3)
)
// particle material
const particleMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    size: 3,
    sizeAttenuation: false,
})
scene.add(new THREE.Points(particleGeometry, particleMaterial))

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(2, 3, 1)
scene.add(directionalLight)

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
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6

const cameraGroup = new THREE.Group()
cameraGroup.add(camera)
scene.add(cameraGroup)

// Get scroll distance
let scroll = window.scrollY
let currentSection = 0
window.addEventListener( 'scroll', () => {
    scroll = window.scrollY
    // console.log(scroll/sizes.height)

    const newSection = Math.round(scroll / sizes.height)

    if(newSection != currentSection) {
        currentSection = newSection
        // console.log(sectionMeshes[currentSection])
        gsap.to(
            sectionMeshes[currentSection].rotation, 
            {
                duration: 1.5,
                ease: 'power3.inOut',
                x: '+=4',
                y: '+=4',
                z: '+=4',
            }
        )
    }

})

/**
 * Cursor Paralax
 */
const cursor = {
    x: 0,
    y: 0,
}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width * 2 - 1
    cursor.y = - (event.clientY / sizes.height) * 2 + 1
})


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastTime
    lastTime = elapsedTime

    // Update camera parallax
    const parallaxX = - cursor.x * 0.2
    const parallaxY = - cursor.y * 0.2
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * deltaTime * 4
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * deltaTime * 4

    // Move camera on scroll
    camera.position.y = - scroll / window.innerHeight * objectsDistance 

    // Animate Objects
    for(const mesh of sectionMeshes){
        mesh.rotation.y -= deltaTime * 0.3
        mesh.rotation.x -= deltaTime * 0.1
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()