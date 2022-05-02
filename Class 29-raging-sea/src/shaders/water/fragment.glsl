uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main() {
    // Mix color with vElevation
    vec3 waveColor = mix(uDepthColor, uSurfaceColor, vElevation * uColorMultiplier + uColorOffset);

    gl_FragColor = vec4(waveColor, 1.0);
}