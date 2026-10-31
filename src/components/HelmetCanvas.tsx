"use client";

import { useEffect, useRef } from "react";
import { fragmentSource, vertexSource } from "@/lib/helmetShader";

export type HeroScene = {
  ignite: number;
  scroll: number;
  lookX: number;
  lookY: number;
  paused: boolean;
};

type Props = {
  scene: React.RefObject<HeroScene>;
  onUnavailable: () => void;
};

const UNIFORMS = [
  "uResolution",
  "uTime",
  "uIgnite",
  "uScroll",
  "uLook",
  "uFrame",
  "uFit",
  "uBladeBase",
  "uBladeTip",
] as const;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "shader");
  }
  return shader;
}

export function HelmetCanvas({ scene, onUnavailable }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      onUnavailable();
      return;
    }

    let program: WebGLProgram | null;
    try {
      program = gl.createProgram();
      if (!program) throw new Error("program");
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? "link");
      }
    } catch (error) {
      console.error(error);
      onUnavailable();
      return;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = Object.fromEntries(
      UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)]),
    ) as Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;

    const portrait = () => canvas.clientWidth / Math.max(canvas.clientHeight, 1) < 0.9;
    let quality = Math.min(window.devicePixelRatio || 1, portrait() ? 1 : 1.5);

    const resize = () => {
      const width = Math.max(1, Math.round(canvas.clientWidth * quality));
      const height = Math.max(1, Math.round(canvas.clientHeight * quality));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    let visible = true;
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(canvas);

    let frame = 0;
    let last = performance.now();
    let elapsed = 0;
    let samples = 0;
    let cost = 0;
    let slowWindows = 0;
    let stopped = false;
    let drawn = false;

    const draw = (now: number) => {
      if (stopped) return;
      frame = requestAnimationFrame(draw);
      // Desenha um quadro mesmo pausado, para o shader já estar pronto quando a abertura acabar
      if (!visible || document.hidden || (scene.current.paused && drawn)) {
        last = now;
        return;
      }

      const delta = now - last;
      last = now;
      elapsed += Math.min(delta, 100) / 1000;

      // Qualidade adaptativa: baixa a resolução antes de cair para a imagem estática
      if (delta < 250) {
        cost += delta;
        samples += 1;
      }
      if (samples === 40) {
        const average = cost / samples;
        cost = 0;
        samples = 0;
        if (average > 26 && quality > 0.42) {
          quality = Math.max(0.42, quality * 0.8);
          resize();
        } else if (average > 60 && quality <= 0.42) {
          slowWindows += 1;
          if (slowWindows >= 3) {
            onUnavailable();
            return;
          }
        }
      }

      const isPortrait = portrait();
      const { ignite, scroll, lookX, lookY } = scene.current;
      const width = canvas.width;
      const height = canvas.height;
      const fit = isPortrait ? Math.min(width * 1.3, height * 0.72) : height;

      gl.uniform2f(uniforms.uResolution, width, height);
      gl.uniform1f(uniforms.uTime, elapsed);
      gl.uniform1f(uniforms.uIgnite, ignite);
      gl.uniform1f(uniforms.uScroll, scroll);
      gl.uniform2f(uniforms.uLook, lookX, lookY);
      gl.uniform1f(uniforms.uFit, fit);

      if (isPortrait) {
        gl.uniform2f(uniforms.uFrame, 0, 0.2);
        gl.uniform3f(uniforms.uBladeBase, 1.16, -3.0, 0.95);
        gl.uniform3f(uniforms.uBladeTip, 0.9, 1.3, 0.95);
      } else {
        const aspect = width / height;
        gl.uniform2f(uniforms.uFrame, Math.min(0.3, 0.17 * aspect), -0.01);
        gl.uniform3f(uniforms.uBladeBase, 1.52, -3.0, 0.7);
        gl.uniform3f(uniforms.uBladeTip, 1.2, 1.2, 0.7);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      drawn = true;
    };

    frame = requestAnimationFrame(draw);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
    };
  }, [scene, onUnavailable]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
