
import { createDerivedMaterial } from 'troika-three-utils'
import { MeshBasicMaterial, DoubleSide } from 'three'

const TextShaderMaterial = createDerivedMaterial(
      new MeshBasicMaterial({ side: DoubleSide }),
  {
    uniforms: {
      // Total width of the text, assigned on synccomplete
      uTime: { value: 0 },
    },
    vertexDefs: `
      uniform float uTime;
    `,
    vertexTransform: `
        float waveAmplitude = 0.1;
        float waveX = uv.x * PI * 4.0 - mod(uTime / 3.0, PI2);
        float waveZ = sin(waveX) * waveAmplitude;
        normal.xyz = normalize(vec3(-cos(waveX) * waveAmplitude, 0.0, 1.0));
        position.y += waveZ;
    `
    /* Secondary example ala https://tympanus.net/codrops/2019/10/10/create-text-in-three-js-with-three-bmfont-text/
    timeUniform: 'time',
    vertexTransform: `
      float frequency1 = 0.035;
      float amplitude1 = 20.0;
      float frequency2 = 0.025;
      float amplitude2 = 70.0;

      // Oscillate vertices up/down
      position.y += (sin(position.x * frequency1 + time / 1000.0) * 0.5 + 0.5) * amplitude1;

      // Oscillate vertices inside/outside
      position.z += (sin(position.x * frequency2 + time / 1000.0) * 0.5 + 0.5) * amplitude2;
    `
    */
  }
);

export default TextShaderMaterial