varying vec3 vColor;

void main() {
    // // Draw discs
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = step(0.5, strength);
    // strength = 1.0 - strength;

    // Diffused points
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength * 2.0;
    // corolize points
    vec3 MixedColor = vColor * strength;

    gl_FragColor = vec4(MixedColor, 1.0);
}