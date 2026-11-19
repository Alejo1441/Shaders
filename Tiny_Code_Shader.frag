precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
#define S smoothstep
#define V vec3
void main(){
vec2 p=gl_FragCoord.xy/u_resolution.y;
float t=.9*u_time,
d=p.x+p.y+.5*sin(5.*p.y+.5*t)+.1*sin(6.*p.x-.35*t),
a=.5+.5*sin(8.*d-t);
V v=mix(V(.45,.1,.7),V(1.,.25,.65),a);
v=mix(v,V(1.,.55,.25),.75*S(-.6,.9,sin(13.*d+.45*t)));
v=mix(v,V(.1,.85,1.),.35*S(.1,1.,sin(18.*d-.6*t)));
gl_FragColor=vec4(mix(V(.08,.02,.22)+p.y*V(.32,.04,.14),v,.45+.55*a)+.12*S(.65,1.,a),1.);
}