uniform vec2 uFrequency;
uniform float uTime;

attribute float aRandom;

// varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main() {
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.y += 0.4;
    modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    modelPosition.z += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;
    vElevation = modelPosition.z;
    // modelPosition.z += aRandom * 0.1;
    // vRandom = aRandom;
    vUv = uv;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
}