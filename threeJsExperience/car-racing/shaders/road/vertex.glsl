varying vec2 vUv;

uniform vec2 uDistortionX;


void main() {
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    modelPosition.z += cos(modelPosition.x * uDistortionX.y ) * uDistortionX.x;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
}