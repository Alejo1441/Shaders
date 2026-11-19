#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
// tiempo transcurrido en segundos

uniform float u_time;

void main(){
    
    //normalización y correción del aspecto
    vec2 st = gl_FragCoord.xy / u_resolution.y;
    
    //velocidad de animación
    float t = u_time * 0.9;
    
    //deformación de las coordenadas
    float curva1 = 0.5 * sin(st.y * 0.5 + t * 0.5);
    float curva2 = 0.1 * sin(st.x * 6.0 -t * 0.35);
        
	//dirección diagonal de las ondas
    float d = st.x +st.y + curva1 + curva2;
    
    //tres ondas de diferente frecuencia y normalizar entre 0 y 1
    
	float a = 0.5 + 0.5 * sin(8.0 * d - t);
	float b = 0.5 + 0.5 * sin(13.0 * d + t * 0.45);
	float c = 0.5 + 0.5 * sin(18.0 * d -t * 0.6);
    
    // paleta de colores
     vec3 rosa = vec3(1.0, 0.25, 0.65);
     vec3 naranja = vec3(1.0, 0.55, 0.25);
	 vec3 violeta = vec3(0.45, 0.10, 0.70);
     vec3 cian = vec3(0.10, 0.85, 1.0);
             
    //degradado del fondo
	vec3 fondo = mix(vec3(0.08, 0.02, 0.22), vec3(0.40, 0.06, 0.36),st.y);

    // primera onda
	vec3 color = mix (cian,rosa, a);
	//segunda onda
    color = mix(color,naranja,smoothstep(0.2,0.95,b)*0.75);
	// tercera onda
    color = mix(color,violeta,smoothstep(0.55,1.0,c)*0.35);
	//iluminación dde las ondas
    float luz = smoothstep(0.65,1.0,a);

    color = mix(fondo,color, 0.45 + 0.55 *a);

    color += 0.12 * luz;

    gl_FragColor = vec4(color,1.0);
					
    
}