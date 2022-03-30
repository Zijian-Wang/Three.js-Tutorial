import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { Mesh } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.show( false )

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(5))

// Fog
const fog = new THREE.Fog('#1A237E', 2, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
// door texture
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAOTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
// bricks
const brickColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const brickAOTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const brickNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const brickRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')
// grass
const grassAOTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')
const grassRepeat = 10
grassAOTexture.wrapS = THREE.RepeatWrapping
grassAOTexture.wrapT = THREE.RepeatWrapping
grassAOTexture.repeat.set(grassRepeat, grassRepeat)
grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping
grassColorTexture.repeat.set(grassRepeat, grassRepeat)
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.repeat.set(grassRepeat, grassRepeat)
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.repeat.set(grassRepeat, grassRepeat)

/**
 * House Group
 */
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: brickColorTexture,
        aoMap: brickAOTexture,
        aoMapIntensity: 1,
        normalMap: brickNormalTexture,
        roughnessMap: brickRoughnessTexture
    })
)
walls.position.set(0, 2.5/2, 0)
walls.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(
        walls.geometry.attributes.uv.array,
        2
    )
)
walls.castShadow = true
walls.receiveShadow = true
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: "Sienna"})
)
roof.position.x = walls.position.x
roof.position.z = walls.position.z
roof.position.y = 2.5 + 0.5
roof.rotation.y = Math.PI / 4
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 2, 64, 64),
    new THREE.MeshStandardMaterial({ 
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        normalMap: doorNormalTexture,
        aoMap: doorAOTexture,
        aoMapIntensity: 1,
        roughnessMap: doorRoughnessTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        displacementBias: 0
    })
)
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(
        door.geometry.attributes.uv.array,
        2
    )
)
door.position.set(0, 0.9, 2)
house.add(door)

// Bushes
const sphere = new THREE.SphereBufferGeometry(1, 32, 32)
const bushMaterial = new THREE.MeshStandardMaterial({ color: 'hsl(88, 50%, 53%)' })

const bush1 = new THREE.Mesh(sphere, bushMaterial)
const bush2 = new THREE.Mesh(sphere, bushMaterial)
const bush3 = new THREE.Mesh(sphere, bushMaterial)
const bush4 = new THREE.Mesh(sphere, bushMaterial)

bush1.position.set(0.8, 0.2, 2)
bush2.position.set(1.4, 0.1, 2.1)
bush3.position.set(-0.8, 0.1, 2.2)
bush4.position.set(-1, 0.05, 2.6)

bush1.scale.set(0.5, 0.5, 0.5)
bush2.scale.set(0.25, 0.25, 0.25)
bush3.scale.set(0.4, 0.4, 0.4)
bush4.scale.set(0.15, 0.15, 0.15)

bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

const bushesGroup = new THREE.Group()
bushesGroup.add(bush1, bush2, bush3, bush4)
house.add(bushesGroup)

// Graves
const graves = new THREE.Group()
const gravesGeometry = new THREE.BoxBufferGeometry(1, 2, 0.2)
const gravesMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

for(let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 6 + 3.5
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    const grave = new THREE.Mesh( gravesGeometry, gravesMaterial)

    grave.position.set(x, 0.3, z)

    grave.rotation.y = Math.random() - 0.5

    grave.scale.set(
        Math.random() * 0.5 + 0.5,
        Math.random() * 0.5 + 0.5,
        Math.random() * 0.5 + 0.5
    )
    grave.castShadow = true
    grave.receiveShadow = true
    graves.add(grave)
}
scene.add(graves)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        // color: '#a9c388' 
        map: grassColorTexture,
        aoMap: grassAOTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(
        floor.geometry.attributes.uv.array,
        2
    )
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.receiveShadow = true
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.189)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
// const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.1)
// moonLight.position.set(4, 5, - 2)
// moonLight.castShadow = true
// gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
// gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
// scene.add(moonLight)

// Door Light
const doorLight = new THREE.PointLight('#ff7d46', 3, 7)
doorLight.position.set(0, 2.2, 2.7)
doorLight.castShadow = true
doorLight.shadow.camera.far = 8
doorLight.shadow.radius = 5
house.add(doorLight)

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#9C27B0', 3, 5)
const ghost2 = new THREE.PointLight('#4FC3F7', 4, 3)
const ghost3 = new THREE.PointLight('#00C853', 2, 5)

ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

ghost1.shadow.camera.far = 4
ghost1.shadow.radius = 3
ghost2.shadow.camera.far = 4
ghost2.shadow.radius = 3
ghost3.shadow.camera.far = 4
ghost3.shadow.radius = 3

scene.add(ghost1, ghost2, ghost3)

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
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 2
camera.position.z = 10
camera.lookAt( new THREE.Vector3(0, 1.8, 0) )
gui.add(camera, 'fov').min(10).max(100).step(5)
gui.onChange(() => camera.updateProjectionMatrix())
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
renderer.setClearColor('#1A237E')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Ghosts Animation
    const ghost1Angle = elapsedTime * 0.5
    const ghost1Radius = 4
    ghost1.position.x = Math.cos(ghost1Angle) * ghost1Radius
    ghost1.position.z = Math.sin(ghost1Angle) * ghost1Radius
    ghost1.position.y = Math.sin(ghost1Angle) * 0.5

    const ghost2Angle = elapsedTime * 0.32
    const ghost2Radius = 6
    ghost2.position.x = Math.sin(ghost2Angle) * ghost2Radius
    ghost2.position.z = Math.cos(ghost2Angle) * ghost2Radius
    ghost2.position.y = Math.sin(ghost2Angle) * 0.5

    const ghost3Angle = - elapsedTime * 0.14
    const ghost3Radius = 7
    ghost3.position.x = Math.cos(ghost3Angle) * ghost3Radius
    ghost3.position.z = Math.sin(ghost3Angle) * ghost3Radius
    ghost3.position.y = Math.sin(ghost3Angle + elapsedTime) * 0.4

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()