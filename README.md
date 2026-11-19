# Práctica de shaders

Para la creación de los patrones generativos, se hace uso de tres funciones sinusoidales con distintas ffrecuencias, obteniendo un conjunto de ondas que se distribuyen diagonalmente por la pantalla

También se usan las funciones mix() y smoothstep()  para combinar los colores de una paleta inspirada en la estética visual del nuevo GTA VI, compuesta por tonos rosas, violetas, naranjas y cian

ahora vamos a entrar un poco más en detalle

```
uniform vec2 u_resolution;
uniform float u_time;
vec2 st = gl_FragCoord.xy/u_resolution;
float t = u_time * 0.2;
```
vec2 u_resolution se utiliza para el tamaño del canvas y luego la dividimos por la resolución de la ventana para normalizarla y que vaya de 1 a 0 y luego u_time multiplicado por una constante, para hacer una animación más lenta y suavizada

para esto se buscó en el guion de la asignatura y el capítulo 3 de The Book of Shaders.
https://thebookofshaders.com/03/?lan=es

```
 float curva1 = 0.50 *sin(st.y *5.0 + t * 0.5);
 float curva2 = 0.1 * sin(st.x * 6.0 -t * 0.35);

 float d = st.x +st.y + curva1 + curva2;

float a = 0.5 + 0.5 * sin(8.0 * d - t);
float b = 0.5 + 0.5 * sin(13.0 * d + t * 0.45);
float c = 0.5 + 0.5 * sin(18.0 * d -t * 0.6);

```
En la primera parte de este cacho de código, se evita que las ondas sean rectas y se hace uso de dos funciones sinusoidales para deformar las coordenadas originales y hacemos que uno dependa de la coordenada horizontal y la otra de la vertical

Posteriormente sumamos las coordenadas  st.x y st.y, para hacer que vayan en diagonal y a este resultado le sumamos las deformaciones anteriores

En la segunda parte se utilizan tres funciones sinusoidales con distinta frecuencia espaciales, concretamente 8, 13 y 18.

La utilización de frecuencias diferentes permite obtener ondas con distintos números de repeticiones. Además, se modifica la fase de cada función en función del tiempo, utilizando diferentes multiplicadores y signos para conseguir que las ondas tengan comportamientos dinámicos diferentes.

para esta parte, se consultó el capítulo 5 de The Book of Shaders y el artículo de Blake Crosley, en el que se describen técnicas de superposición de ondas

https://blakecrosley.com/es/blog/glsl-shader-lab
https://thebookofshaders.com/05/?lan=es

```
 vec3 rosa = vec3(1.0, 0.25, 0.65);
 vec3 naranja = vec3(1.0, 0.55, 0.25);
 vec3 violeta = vec3(0.45, 0.10, 0.70);
 vec3 cian = vec3(0.10, 0.85, 1.0);
```
Aquí, no hay mucho que comentar, simplemente se inicializan una serie de vectores en RGB, para su utilización

```
vec3 fondo = mix(vec3(0.08, 0.02, 0.22), vec3(0.40, 0.06, 0.36),st.y);

vec3 color = mix(violeta, rosa, a);

color = mix(color, naranja,
    smoothstep(0.2, 0.95, b) * 0.75);

color = mix(color, cian,
    smoothstep(0.55, 1.0, c) * 0.35);
```

En esta parte del código se hace uso de la función mix(), que permite mezclar dos valores en porcentaje, y obteniendo un valor entre 0 y 1

En primer lugar, se crea un degradado para el fondo utilizando dos tonos violetas y la coordenada vertical, consiguiendo que el color varíe dependiendo de la altura del fragmento.

Posteriormente, se utiliza la primera onda, "a", para realizar una mezcla entre el color violeta y el rosa 

Para las dos últimas mezclas, se utiliza la función smoothstep, con el objetivo de conseguir transiciones suaves entre los colores, además se utilizan constantes de 0,75 y 0,35 para controlar la influencia del naranja y el cian, evitando que tengan demasiado protagonismo

para esta parte se consulto el capítulo 5 y 6 de The Book of Shaders.


https://thebookofshaders.com/06/?lan=es
https://thebookofshaders.com/05/?lan=es

```
float luz = smoothstep(0.65,1.0,a);

color = mix(fondo,color, 0.45 + 0.55 *a);

color += 0.12 * luz;

gl_FragColor = vec4(color,1.0);
```

Por último, se añade un efecto de iluminación a las ondas. Para ello se vuelve a utilizar la función smoothstep, tomando como referencia la primera onda, a. Con esto se consigue que la iluminación aparezca progresivamente  en las zonas donde la onda alcanza sus valores más altos

Para controlar esta mezcla se utiliza la expresión 0.45 + 0.55 * a, consiguiendo que la influencia de las ondas sobre el fondo varíe dependiendo del valor de la primera función sinusoidal. Esto permite obtener zonas más oscuras y otras más luminosas, generando una sensación de profundidad.

Y para esta parte también se han usado los capítulos 5 y 6 de Book of Shaders.



Para acabar, hare una explicación del tiny code que he realizado

```
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
#define S smoothstep
#define V vec3
void main(){
vec2 p=gl_FragCoord.xy/u_resolution.y;
float t=.9*u_time,
d=p.x+p.y+.5*sin(5.*p.y+.5*t)+.1*sin(6.*p.x-.35*t), // direccion diagona y deformación de las coordenadas
a=.5+.5*sin(8.*d-t);                                // primera onda normalizada entre 0 y 1
V v=mix(V(.45,.1,.7),V(1.,.25,.65),a);              // mezcla de violeta y rosa
v=mix(v,V(1.,.55,.25),.75*S(-.6,.9,sin(13.*d+.45*t)));  // segunda onda: introduccion naranja
v=mix(v,V(.1,.85,1.),.35*S(.1,1.,sin(18.*d-.6*t)));     // tercera onda: introducción del cian
gl_FragColor=vec4(mix(V(.08,.02,.22)+p.y*V(.32,.04,.14),v,.45+.55*a)+.12*S(.65,1.,a),1.);
}   // en esta ultima linea se hace, el degradado del fondo, mezcla de colores e iluminación
    // tambien se agrupan las operaciones para reducir el tamaño
```

En primer lugar, se ahce uso de las macros mediante #define, sustituyendo smoothsteep por S y vec3 por V, ya que son expresiones que se utlicen varias veces

Tambien se reduce el nombre de las variables, se eliminan los espacios y ceros innecesarios de los valores decimales y se agrupan las declaraciones de variables que son del mismo tipo

Por otro lado, se eliminan variables intermedias, realizando calculos directamente dentro de otras expresiones. EN el caso de la segunda y tercera onda, se modifican los límites de smoothsteep() para evitar que tener que normalizar previamente.

Por último, se sustituye la interpolación del fondo por su expresion matemática equivalente y se agrupan las operaciones de mezcla de colores e iluminación en la asignación de gl_FragColor




