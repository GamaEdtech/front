precision mediump float;

uniform vec3 uColor;
uniform float uWidthLineArround;
uniform float uWidthLineSeperator;
uniform float uCountLine;
uniform vec3 uColorLineSeperator;
uniform vec3 uColorLineArround;

varying vec2 vUv;


void main() {

   // line around Road
   float strengthLineAroundRoad = 1.0 - step(uWidthLineArround,vUv.y); 
   strengthLineAroundRoad += step(1.0 - uWidthLineArround,vUv.y);
   vec3 whiteColor = uColorLineArround;
   vec3 mixColorLineAroundRoad = mix(vec3(0.0),whiteColor,strengthLineAroundRoad);



    // line seperator Road
    vec3 lineSeperatorColor = uColorLineSeperator;
    vec3 blackColor = vec3(0.0);

    float strengthSeperatorLine = 0.0;
    float eachWidthLine = (1.0 - 2.0 * uWidthLineArround) / uCountLine;
    for(float i = 0.0 ; i < uCountLine - 1.0 ; i++){
        strengthSeperatorLine += step( uWidthLineArround + (eachWidthLine * ( i + 1.0)) , vUv.y); 
        strengthSeperatorLine *= 1.0 - step(uWidthLineArround + (eachWidthLine * ( i + 1.0)) +  uWidthLineSeperator,vUv.y);
        strengthSeperatorLine *= step(0.6, mod(vUv.x*100.0,1.0));        
    }

    vec3 mixColorSeperatorLine = mix(uColor,lineSeperatorColor,strengthSeperatorLine);



    mixColorSeperatorLine += mixColorLineAroundRoad;
    gl_FragColor = vec4(mixColorSeperatorLine, 1.0);
}
