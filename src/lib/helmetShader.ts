// Capacete original modelado só com matemática (SDF + raymarching), sem nenhum asset externo.
export const vertexSource = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

export const fragmentSource = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uIgnite;
uniform float uScroll;
uniform vec2 uLook;
uniform vec2 uFrame;
uniform float uFit;
uniform vec3 uBladeBase;
uniform vec3 uBladeTip;

out vec4 outColor;

const float ARMOR = 1.0;
const float LENS = 2.0;
const float GRILLE = 3.0;

mat2 rotate(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float smax(float a, float b, float k) {
  return -smin(-a, -b, k);
}

float ellipsoid(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / k1;
}

float capsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a;
  vec3 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

float triangle2d(vec2 p, vec2 a, vec2 b, vec2 c) {
  vec2 e0 = b - a, e1 = c - b, e2 = a - c;
  vec2 v0 = p - a, v1 = p - b, v2 = p - c;
  vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
  vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
  vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
  float s = sign(e0.x * e2.y - e0.y * e2.x);
  vec2 d = min(min(
    vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
    vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
    vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
  return -sqrt(d.x) * sign(d.y);
}

vec2 helmet(vec3 p) {
  vec3 q = vec3(abs(p.x), p.yz);

  // Cúpula com crista central
  float dome = ellipsoid(p - vec3(0.0, 0.38, -0.08), vec3(0.98, 0.86, 1.06));
  dome = smin(dome, ellipsoid(p - vec3(0.0, 0.40, -0.08), vec3(0.055, 0.895, 1.10)), 0.055);
  // A cúpula termina na linha da sobrancelha para não engolir a máscara
  dome = smax(dome, 0.08 + 0.27 * q.x - p.y - max(0.0, 0.18 - p.z) * 3.0, 0.03);

  // Saia alargada, mais longa atrás e aberta na frente
  float t = clamp((0.22 - p.y) / 1.5, 0.0, 1.0);
  float flare = 0.93 + 0.12 * t + 0.42 * t * t;
  float skirt = abs(length(p.xz * vec2(1.0, 0.96)) - flare) - 0.03;
  float lowerEdge = -1.24 + 0.42 * smoothstep(-0.25, 0.45, p.z);
  skirt = smax(skirt * 0.75, lowerEdge - p.y, 0.03);
  skirt = smax(skirt, p.y - 0.28, 0.03);
  skirt = smax(skirt, p.z + 0.22 * q.x - 0.46, 0.04);

  float inner = ellipsoid(p - vec3(0.0, -0.22, -0.16), vec3(0.66, 0.84, 0.70));

  // Máscara facetada
  float base = ellipsoid(p - vec3(0.0, -0.12, 0.30), vec3(0.74, 0.92, 0.78));
  base = smax(base, dot(q, normalize(vec3(0.72, -0.12, 0.68))) - 0.74, 0.035);
  base = smax(base, dot(q, normalize(vec3(0.42, -0.74, 0.50))) - 0.98, 0.05);
  base = smax(base, -0.90 - p.y, 0.05);

  // Cavidade dos olhos
  float eye = triangle2d(q.xy, vec2(0.095, 0.045), vec2(0.56, 0.205), vec2(0.33, -0.17)) - 0.024;
  float socket = max(eye, 0.42 - q.z);

  float mask = smax(base, -socket, 0.018);

  // Sobrancelha angular, nariz e presas
  mask = smin(mask, capsule(q, vec3(0.0, 0.135, 1.03), vec3(0.72, 0.36, 0.46), 0.055), 0.05);
  mask = smin(mask, ellipsoid(p - vec3(0.0, -0.07, 0.99), vec3(0.052, 0.27, 0.11)), 0.035);
  mask = smin(mask, capsule(q, vec3(0.41, -0.29, 0.61), vec3(0.31, -0.86, 0.63), 0.042), 0.045);

  float armor = min(min(dome, inner), skirt);
  armor = smin(armor, mask, 0.025);

  // Lentes afundadas na máscara
  float lens = max(base + 0.045, eye - 0.012);

  // Grade triangular da boca com fendas
  float prism = triangle2d(p.xy, vec2(0.0, -0.20), vec2(0.27, -0.84), vec2(-0.27, -0.84)) - 0.012;
  float grille = smax(base - 0.065, prism, 0.022);
  float slit = abs(mod(q.x + 0.031, 0.062) - 0.031) - 0.0115;
  grille = smax(grille, -max(slit, -(base - 0.018)), 0.005);

  vec2 res = vec2(armor, ARMOR);
  if (lens < res.x) res = vec2(lens, LENS);
  if (grille < res.x) res = vec2(grille, GRILLE);
  return res;
}

vec3 toHelmet(vec3 p) {
  float yaw = -0.15 - 0.26 * uScroll + uLook.x * 0.12;
  float pitch = -0.02 + 0.06 * uScroll + uLook.y * 0.07;
  // Respiração bem lenta, quase imperceptível
  p.y -= sin(uTime * 0.72) * 0.012;
  p.xz = rotate(yaw) * p.xz;
  p.yz = rotate(pitch) * p.yz;
  return p;
}

vec2 map(vec3 p) {
  return helmet(toHelmet(p));
}

vec3 normalAt(vec3 p) {
  const vec2 e = vec2(1.0, -1.0) * 0.0012;
  return normalize(
    e.xyy * map(p + e.xyy).x +
    e.yyx * map(p + e.yyx).x +
    e.yxy * map(p + e.yxy).x +
    e.xxx * map(p + e.xxx).x);
}

float occlusion(vec3 p, vec3 n) {
  float value = 0.0;
  float weight = 1.0;
  for (int i = 1; i <= 3; i++) {
    float h = 0.045 * float(i);
    value += weight * (h - map(p + n * h).x);
    weight *= 0.55;
  }
  return clamp(1.0 - 3.0 * value, 0.0, 1.0);
}

float softShadow(vec3 p, vec3 l, float limit) {
  float shade = 1.0;
  float t = 0.035;
  for (int i = 0; i < 14; i++) {
    float h = map(p + l * t).x;
    shade = min(shade, 9.0 * h / t);
    t += clamp(h, 0.025, 0.28);
    if (shade < 0.01 || t > limit) break;
  }
  return clamp(shade, 0.0, 1.0);
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

// Distância entre o raio e a lâmina, para o brilho volumétrico
float rayToSegment(vec3 ro, vec3 rd, vec3 a, vec3 b) {
  vec3 u = b - a;
  vec3 w = ro - a;
  float uu = dot(u, u);
  float ud = dot(u, rd);
  float uw = dot(u, w);
  float dw = dot(rd, w);
  float s = clamp((uw - ud * dw) / max(uu - ud * ud, 1e-4), 0.0, 1.0);
  float r = max(dot(a + u * s - ro, rd), 0.0);
  return length(ro + rd * r - (a + u * s));
}

vec3 environment(vec3 r) {
  // Reflexo discreto de painéis de luz fria, como um corredor de nave
  float strip = smoothstep(0.78, 0.98, r.y) * 0.1;
  strip += smoothstep(0.03, 0.0, abs(r.x + 0.46 - r.y * 0.16)) * smoothstep(0.1, 0.65, r.y) * 0.3;
  // Painel à esquerda, para a metade sem sabre continuar legível sem virar plástico
  strip += smoothstep(0.32, 0.86, -r.x + r.y * 0.3) * smoothstep(-0.2, 0.3, r.y) * smoothstep(-0.3, 0.3, r.z) * 0.11;
  return vec3(0.46, 0.53, 0.66) * strip;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uFit;
  uv -= uFrame;

  float dolly = 1.0 - pow(1.0 - uScroll, 2.0);
  vec3 ro = vec3(0.0, 0.0, 6.4 - 1.7 * dolly);
  vec3 rd = normalize(vec3(uv, -1.95));

  float flicker = 0.965 + 0.035 * sin(uTime * 37.0) * sin(uTime * 13.0);
  float power = uIgnite * flicker;
  // A lâmina acompanha a aproximação da câmera para continuar em quadro
  vec3 bladeScale = vec3(vec2(1.0 - 0.27 * dolly), 1.0);
  vec3 bladeBase = uBladeBase * bladeScale;
  vec3 tip = mix(bladeBase, uBladeTip * bladeScale, uIgnite);

  float travel = 0.0;
  float material = 0.0;
  float glowArmor = 0.0;
  for (int i = 0; i < 72; i++) {
    vec2 h = map(ro + rd * travel);
    if (h.x < 0.0012) {
      material = h.y;
      break;
    }
    glowArmor += 0.012 / (1.0 + h.x * h.x * 55.0);
    travel += h.x * 0.85;
    if (travel > 10.0) break;
  }

  // Fundo: quase preto, com névoa iluminada pela lâmina e poucas estrelas
  float fog = valueNoise(uv * 2.4 + vec2(uTime * 0.03, -uTime * 0.018));
  fog = fog * 0.65 + valueNoise(uv * 5.3 - vec2(uTime * 0.02, 0.0)) * 0.35;
  vec3 col = vec3(0.006, 0.007, 0.011);
  vec2 starGrid = uv * 70.0;
  vec2 starId = floor(starGrid);
  vec2 starOffset = vec2(hash(starId + 7.0), hash(starId + 19.0)) * 0.7 + 0.15;
  float starDot = smoothstep(0.075, 0.0, length(fract(starGrid) - starOffset));
  col += vec3(0.5, 0.54, 0.62) * step(0.965, hash(starId)) * starDot * (0.25 + 0.75 * hash(starId + 3.0));
  float bladeSide = rayToSegment(ro, rd, bladeBase, tip);
  col += vec3(0.62, 0.02, 0.018) * fog * power * 0.20 / (1.0 + bladeSide * bladeSide * 1.5);
  vec3 background = col;

  if (material > 0.0) {
    vec3 p = ro + rd * travel;
    vec3 n = normalAt(p);
    vec3 v = -rd;
    float ao = occlusion(p, n);
    float fresnel = pow(1.0 - max(dot(n, v), 0.0), 3.5);

    vec3 reflected = reflect(rd, n);

    // Luz vermelha da lâmina: ponto mais próximo no segmento
    vec3 axis = tip - bladeBase;
    float along = clamp(dot(p - bladeBase, axis) / max(dot(axis, axis), 1e-4), 0.0, 1.0);
    vec3 toBlade = bladeBase + axis * along - p;
    float distance2 = dot(toBlade, toBlade);
    vec3 l = toBlade / sqrt(distance2);
    float attenuation = power * 3.0 / (1.0 + distance2 * 1.05);
    if (attenuation > 0.001) attenuation *= softShadow(p + n * 0.006, l, sqrt(distance2));
    float diffuse = max(dot(n, l), 0.0);
    float specular = pow(max(dot(reflected, l), 0.0), 54.0);

    // Luz fria de recorte, de cima e por trás
    vec3 rimDirection = normalize(vec3(-0.62, 0.72, -0.26));
    float rim = pow(max(dot(n, rimDirection), 0.0), 2.4) * 0.15;

    vec3 keyDirection = normalize(vec3(-0.6, 0.42, 0.68));
    float key = max(dot(n, keyDirection), 0.0);
    float keySpecular = pow(max(dot(reflected, keyDirection), 0.0), 26.0);

    vec3 base = vec3(0.0075, 0.008, 0.0095);
    float gloss = 1.0;
    float specularBoost = 3.2;
    if (material == GRILLE) {
      base = vec3(0.018, 0.019, 0.022);
      gloss = 0.8;
      specularBoost = 2.2;
    } else if (material == LENS) {
      base = vec3(0.004, 0.0, 0.002);
      gloss = 1.6;
      specularBoost = 4.5;
    }

    vec3 red = vec3(1.0, 0.055, 0.04);
    col = base * (0.16 + rim + key * 0.9) * ao;
    col += vec3(0.42, 0.48, 0.60) * keySpecular * 0.085 * gloss * ao;
    col += base * red * diffuse * attenuation * 8.0 * ao;
    col += red * specular * attenuation * specularBoost;
    col += red * diffuse * diffuse * attenuation * 0.02 * ao;
    col += environment(reflected) * (0.32 + fresnel * 1.5) * gloss * ao;
    col += vec3(0.28, 0.33, 0.42) * rim * fresnel * 1.7;

    if (material == LENS) {
      // Brasa concentrada no canto externo, em vez de uma lente chapada
      vec3 local = toHelmet(p);
      float ember = 0.006 + 0.05 * power;
      float pool = smoothstep(0.62, 0.05, length((abs(local.xy) - vec2(0.42, 0.08)) * vec2(1.0, 1.7)));
      col += vec3(0.9, 0.035, 0.018) * ember * (0.15 + pool * pool * 1.6);
    }

    // A base do capacete se dissolve no fundo
    col = mix(background, col, smoothstep(-1.2, -0.68, p.y));
  } else {
    col += vec3(0.42, 0.45, 0.55) * glowArmor * 0.012;
  }

  // Lâmina: núcleo branco e halo vermelho
  float d = rayToSegment(ro, rd, bladeBase, tip);
  if (uIgnite > 0.001) {
    float core = smoothstep(0.024, 0.010, d);
    float halo = 0.0052 / (d * d + 0.0026);
    float wide = 0.075 / (d * 8.0 + 0.14);
    col += vec3(1.0, 0.075, 0.05) * (halo * 0.62 + wide * 0.16) * power;
    col = mix(col, vec3(5.0, 4.3, 4.0), core * min(power * 1.2, 1.0));
  }

  // Vinheta, escurecimento de saída e tonemap
  float vignette = 1.0 - 0.34 * dot(uv * 0.72, uv * 0.72);
  col *= clamp(vignette, 0.0, 1.0);
  col *= 1.0 - smoothstep(0.78, 1.0, uScroll);
  col = col / (1.0 + col * 0.62);
  col = pow(max(col, 0.0), vec3(0.4545));
  col += (hash(gl_FragCoord.xy * 0.013 + fract(uTime)) - 0.5) * 0.012;

  outColor = vec4(col, 1.0);
}`;
