import alea from "alea";
import { createNoise2D } from "simplex-noise";

export interface SampleGridOptions {
  width: number;
  height: number;
  cellSize: number;
  xOff?: number;
  yOff?: number;
}

export interface SampleGrid {
  grid: number[][];
  cellSize: number;
}

export type SampledFunction = (x: number, y: number) => number;

export function sampleGrid(
  fn: SampledFunction,
  { width, height, cellSize, xOff = 0, yOff = 0 }: SampleGridOptions,
) {
  const cols = Math.ceil(width / cellSize) + 1;
  const rows = Math.ceil(height / cellSize) + 1;
  const grid: number[][] = [];

  for (let u = 0; u < rows; u++) {
    const row: number[] = [];
    for (let v = 0; v < cols; v++) {
      const x = v * cellSize + xOff;
      const y = u * cellSize + yOff;
      const value = fn(x, y);
      row.push(value);
    }
    grid.push(row);
  }

  return { grid, cellSize };
}

export interface NoiseSettings {
  seed: number;
  scale: number;
}

export function simplexNoiseGrid(
  { seed, scale }: NoiseSettings,
  options: SampleGridOptions,
) {
  const prng = alea(seed);
  const noise = createNoise2D(prng);
  return sampleGrid((x, y) => noise(x * scale, y * scale), options);
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function map(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
