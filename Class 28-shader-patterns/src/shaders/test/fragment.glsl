varying vec2 vUv;

float random(vec2 st){
    return fract(sin(dot(st.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()
{
    // // Pattern 3
    // float pattern3 = vUv.x;

    // // Pattern 4
    // float pattern4 = vUv.y;

    // // Pattern 5
    // float pattern5 = 1.0 - vUv.y;

    // // Pattern 6
    // float pattern6 = vUv.y * 10.0;

    // // Pattern 7
    // float pattern7 = mod(vUv.y * 10.0, 1.0);

    // // Pattern 8
    // float pattern8 = mod(vUv.y * 10.0, 1.0);
    // pattern8 = step(0.9, pattern8);

    // // Pattern 9
    // float pattern9 = mod(vUv.x * 10.0, 1.0);
    // pattern9 = step(0.9, pattern9);

    // // Pattern 10
    // float pattern10 = step(0.8, mod(vUv.x * 10.0, 1.0));
    // pattern10 += step(0.8, mod(vUv.y * 10.0, 1.0));

    // // Pattern 11
    // float pattern11 = step(0.4, mod(vUv.x * 10.0, 1.0));
    // pattern11 *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // // Pattern 12
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0));
    // barY *= step(0.8, mod(vUv.x * 10.0, 1.0));
    // float pattern12 = barX + barY;

    // // Pattern 13
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0));
    // barY *= step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    // float pattern13 = barX + barY;

    // // Pattern 14
    // float pattern14 = abs(vUv.x  - 0.5);

    // // Pattern 15
    // // float pattern15 = max(abs(vUv.x  - 0.5), abs(vUv.y  - 0.5));
    // float square_1 = step(0.2, max(abs(vUv.x  - 0.5), abs(vUv.y  - 0.5)));
    // float square_2 = 1.0 - step(0.3, max(abs(vUv.x  - 0.5), abs(vUv.y  - 0.5)));
    // float pattern15 = square_1 * square_2;

    // // Pattern 16
    // float pattern16 = (floor(vUv.x * 10.0) / 10.0) * (floor(vUv.y * 10.0) / 10.0);

    // // Pattern 17
    // vec2 seed = vec2 ((floor(vUv.x * 10.0) / 10.0), (floor(vUv.y * 10.0) / 10.0));
    // float pattern17 = random(seed);

    // // Pattern 18
    // vec2 seed = vec2 (
    //     floor(vUv.x * 10.0) / 10.0, 
    //     floor(vUv.y * 10.0 + vUv.x * 2.5) / 10.0
    // );
    // float pattern18 = random(seed);

    // // Pattern 19
    // // float pattern19 = length(vUv - 0.5);
    // float pattern19 = distance(vUv, vec2(0.5));

    // // Pattern 20
    // float pattern20 = pow(1.0 - distance(vUv, vec2(0.5)), 20.0);

    // // Pattern 21
    // float pattern21 = 0.01 / distance(vUv, vec2(0.5));

    // Pattern 22
    float pattern22 = 0.01 / distance(vUv, vec2(0.5));

    gl_FragColor = vec4(pattern22, pattern22, pattern22, 1.0);
}