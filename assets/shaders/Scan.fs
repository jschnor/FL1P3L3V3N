uniform sampler2D tDiffuse;
uniform float fAmount;

varying vec2 vUv;

void main() {
    vec4 texel = texture2D(tDiffuse, vUv);
    vec3 color = texel.rgb;
    vec2 fc = gl_FragCoord.xy;
    
    if (mod( fc.x + fc.y, fAmount ) > 2.0) color *= 0.9;
    
    gl_FragColor = vec4(color, 1.0);
    
}