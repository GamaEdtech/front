// Simplex 2D noise
//
// vec3 permute(vec3 x) { return mod(((x*44.0)+1.0)*x, 299.0); }

// float simplexNoise2d(vec2 v)
// {
//     const vec4 C = vec4(0.211324865405187, 0.366025403784439,
//             -0.577350269189626, 0.024390243902439);
//     vec2 i  = floor(v + dot(v, C.yy) );
//     vec2 x0 = v -   i + dot(i, C.xx);
//     vec2 i1;
//     i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
//     vec4 x12 = x0.xyxy + C.xxzz;
//     x12.xy -= i1;
//     i = mod(i, 299.0);
//     vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
//     + i.x + vec3(0.0, i1.x, 1.0 ));
//     vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
//     dot(x12.zw,x12.zw)), 0.0);
//     m = m*m ;
//     m = m*m ;
//     vec3 x = 2.0 * fract(p * C.www) - 1.0;
//     vec3 h = abs(x) - 0.5;
//     vec3 ox = floor(x + 0.5);
//     vec3 a0 = x - ox;
//     m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
//     vec3 g;
//     g.x  = a0.x  * x0.x  + h.x  * x0.y;
//     g.yz = a0.yz * x12.xz + h.yz * x12.yw;
//     return 130.0 * dot(m, g);
// }



uniform vec3 uColorWaterDeep;
uniform vec3 uColorWaterSurface;
uniform vec3 uColorSand;
uniform vec3 uColorGrass;
uniform vec3 uColorSnow;
uniform vec3 uColorRock;
uniform sampler2D uPerlinTexture;


varying vec3 vPosition;
varying float vUpDot;


float getNoiseFromTexture(vec2 uv) {
    float noise = texture2D(uPerlinTexture, fract(uv)).r;

    return noise * 2.0 - 1.0;
}

void main() {

    // Color 
    vec3 color = vec3(1.0);


    // Water
    float surfaceWaterMix = smoothstep(-1.0,-0.1, vPosition.y);
    color = mix(uColorWaterDeep, uColorWaterSurface, surfaceWaterMix);


    // Sand 
    float sandMix = step(-0.1,vPosition.y);
    color = mix(color , uColorSand, sandMix);

    // Grass
    float grassMix = step(-0.06, vPosition.y);
    color = mix(color, uColorGrass, grassMix);

    // Rock
    float rockMix = vUpDot;
    rockMix = 1.0 - step(0.8, rockMix);
    rockMix *= step(-0.06,vPosition.y); 
    color = mix(color , uColorRock, rockMix);

    // Snow 
    float snowThreshold = 8.0;
    snowThreshold += getNoiseFromTexture(vPosition.xz * 5.0) * 2.0;
    // snowThreshold += simplexNoise2d(vPosition.xz * 15.0) * 0.1;
    float snowMix = step(snowThreshold, vPosition.y);
    color = mix(color,uColorSnow, snowMix);

    // Final Color
    csm_DiffuseColor = vec4(color, 1.0);
}