uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vWobble;

void main(){

    float colorMix = smoothstep(-1.0, 6.0, vWobble);

    csm_Metalness = vWobble * 2.0;
    csm_Roughness = 1.0 - csm_Metalness;

    csm_DiffuseColor.rgb = mix(uColorA, uColorB, colorMix);
}