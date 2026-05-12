"use client";
import React, { useEffect, useRef } from "react";
import { liquidFragSource } from "./liquid-frag";

const vertShaderSource = `#version 300 es
in vec2 position;
out vec2 vUv;
void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

interface LiquidFragRendererProps {
  imageSrc: string;
  className?: string;
}

export default function LiquidFragRenderer({ imageSrc, className }: LiquidFragRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { antialias: true, alpha: true });
    if (!gl) {
      console.warn("WebGL2 not supported");
      return;
    }

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vShader = compileShader(gl.VERTEX_SHADER, vertShaderSource);
    const fShader = compileShader(gl.FRAGMENT_SHADER, liquidFragSource);
    if (!vShader || !fShader) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const locs = {
      time: gl.getUniformLocation(program, "u_time"),
      ratio: gl.getUniformLocation(program, "u_ratio"),
      imgRatio: gl.getUniformLocation(program, "u_img_ratio"),
      patternScale: gl.getUniformLocation(program, "u_patternScale"),
      refraction: gl.getUniformLocation(program, "u_refraction"),
      edge: gl.getUniformLocation(program, "u_edge"),
      patternBlur: gl.getUniformLocation(program, "u_patternBlur"),
      liquid: gl.getUniformLocation(program, "u_liquid"),
      imageTexture: gl.getUniformLocation(program, "u_image_texture"),
    };

    // "minimalism & cuteness" parameters for the shader
    gl.uniform1f(locs.patternScale, 3.5);
    gl.uniform1f(locs.refraction, 0.04);
    gl.uniform1f(locs.edge, 0.3);
    gl.uniform1f(locs.patternBlur, 0.015);
    gl.uniform1f(locs.liquid, 0.8);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));

    const img = new Image();
    img.crossOrigin = "anonymous";
    let imgRatio = 1.0;
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      imgRatio = img.width / img.height;
      gl.uniform1f(locs.imgRatio, imgRatio);
    };
    img.src = imageSrc;

    let startTime = performance.now();
    let animationFrame: number;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width * dpr;
      const height = rect.height * dpr;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      gl.uniform1f(locs.ratio, width / height);
      gl.uniform1f(locs.time, performance.now() - startTime);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.bindVertexArray(vao);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(locs.imageTexture, 0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrame = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      gl.deleteProgram(program);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      gl.deleteBuffer(vbo);
      gl.deleteVertexArray(vao);
      gl.deleteTexture(texture);
    };
  }, [imageSrc]);

  return <canvas ref={canvasRef} className={className} />;
}
