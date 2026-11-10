import { useEffect, useLayoutEffect, useRef } from "react";

const FONT: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
};

const NAME = "MATHEWS SHAJI";

export const INTRO_SEEN_KEY = "intro-seen";
const ROWS = 7;

// Milliseconds.
const BUILD_START = 300;
const BUILD_END = 2100;
const INVERT_START = 2250;
const INVERT_DURATION = 1800; // matches the standalone demo's wipe speed
const INVERT_END = INVERT_START + INVERT_DURATION;
const DOCK_START = 4150;
const DOCK_DURATION = 850;

// Ring Storm: width of the travelling wavefront, and how many steps a tile grows in.
const STORM_BAND = 0.2;
const STORM_STEPS = 3;

// Match the quick backdrop clearing in the cancellation reference.
const EXIT_DURATION = 600;

function buildColumns(text: string) {
  const columns: number[][] = [];
  for (const character of text) {
    if (character === " ") {
      for (let i = 0; i < 3; i++) columns.push(Array(ROWS).fill(0));
      continue;
    }
    const glyph = FONT[character];
    if (!glyph) continue;
    for (let column = 0; column < 5; column++) {
      columns.push(glyph.map((row) => (row[column] === "1" ? 1 : 0)));
    }
    columns.push(Array(ROWS).fill(0));
  }
  return columns;
}

const COLUMNS = buildColumns(NAME);
const DOCK_CELL = 1.7;

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeInOutQuad(value: number): number {
  return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
}

export function IntroName({
  onComplete,
  onTransitionStart,
}: {
  onComplete: () => void;
  onTransitionStart?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const mosaicRef = useRef<HTMLCanvasElement>(null);
  const completedRef = useRef(false);
  const leavingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    if (!canvas || !overlay || !backdrop) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_SEEN_KEY) !== null;
    } catch {
      // sessionStorage can be blocked
    }
    if (reduced || seen) {
      completedRef.current = true;
      onComplete();
      return;
    }

    const context = canvas.getContext("2d");
    const mosaic = mosaicRef.current;
    const mosaicContext = mosaic?.getContext("2d");
    if (!context || !mosaic || !mosaicContext) {
      completedRef.current = true;
      onComplete();
      return;
    }

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frameId = 0;
    let start = 0;

    // Value-noise fbm, seeded once per mount (same shape as the standalone demo).
    const fbm = (() => {
      const sizes = [8, 16, 32];
      const amps = [0.4, 0.35, 0.25];
      const grids = sizes.map((size) => {
        const grid = new Float32Array((size + 1) * (size + 1));
        for (let i = 0; i < grid.length; i++) grid[i] = Math.random();
        return grid;
      });
      return (u: number, v: number) => {
        let sum = 0;
        for (let o = 0; o < sizes.length; o++) {
          const size = sizes[o]!;
          const grid = grids[o]!;
          // Edge tiles extend past the viewport; keep noise samples inside the grid.
          const x = Math.max(0, Math.min(1, u)) * size;
          const y = Math.max(0, Math.min(1, v)) * size;
          const xi = Math.floor(x);
          const yi = Math.floor(y);
          let fx = x - xi;
          let fy = y - yi;
          fx = fx * fx * (3 - 2 * fx);
          fy = fy * fy * (3 - 2 * fy);
          const xi1 = Math.min(xi + 1, size);
          const yi1 = Math.min(yi + 1, size);
          const a = grid[yi * (size + 1) + xi]!;
          const b = grid[yi * (size + 1) + xi1]!;
          const c = grid[yi1 * (size + 1) + xi]!;
          const d = grid[yi1 * (size + 1) + xi1]!;
          const top = a + (b - a) * fx;
          const bottom = c + (d - c) * fx;
          sum += (top + (bottom - top) * fy) * amps[o]!;
        }
        return sum;
      };
    })();

    type StormField = {
      t: Float32Array;
      cols: number;
      rows: number;
      colStart: number;
      rowStart: number;
    };

    let storm: StormField | null = null;
    let stormKey = "";

    // Reveal order per tile: Chebyshev ring from the name, roughened by fbm + noise.
    const getStorm = (
      tile: number,
      originX: number,
      originY: number,
      w: number,
      h: number,
      ox: number,
      oy: number,
    ): StormField => {
      const key = `${tile}:${originX}:${originY}:${w}:${h}:${Math.round(ox)}:${Math.round(oy)}`;
      if (storm && stormKey === key) return storm;

      const colStart = Math.floor(-originX / tile);
      const colEnd = Math.ceil((w - originX) / tile);
      const rowStart = Math.floor(-originY / tile);
      const rowEnd = Math.ceil((h - originY) / tile);
      const cols = colEnd - colStart;
      const rows = rowEnd - rowStart;
      const t = new Float32Array(cols * rows);
      const maxC = Math.max(Math.max(ox, w - ox), Math.max(oy, h - oy)) || 1;

      let lo = Infinity;
      let hi = -Infinity;
      let i = 0;
      for (let row = rowStart; row < rowEnd; row++) {
        for (let col = colStart; col < colEnd; col++) {
          const cx = originX + col * tile + tile / 2;
          const cy = originY + row * tile + tile / 2;
          const ring = Math.max(Math.abs(cx - ox), Math.abs(cy - oy)) / maxC;
          const value = ring * 0.62 + fbm(cx / w, cy / h) * 0.16 + Math.random() * 0.22;
          t[i++] = value;
          if (value < lo) lo = value;
          if (value > hi) hi = value;
        }
      }
      const span = hi - lo || 1;
      for (let k = 0; k < t.length; k++) t[k] = (t[k]! - lo) / span;

      storm = { t, cols, rows, colStart, rowStart };
      stormKey = key;
      return storm;
    };

    const startExit = (dockName = false) => {
      if (leavingRef.current || completedRef.current) return;
      leavingRef.current = true;
      cancelAnimationFrame(frameId);
      overlay.classList.add("intro-loader--leaving");
      onTransitionStart?.();

      // Clear the current intro as a single wash, matching cancellation.
      // The content underneath stays sharp and fully opaque.
      const snapshot = document.createElement("canvas");
      snapshot.width = canvas.width;
      snapshot.height = canvas.height;
      const snapshotContext = snapshot.getContext("2d");
      if (!snapshotContext) {
        completedRef.current = true;
        onComplete();
        return;
      }
      snapshotContext.fillStyle = backdrop.style.backgroundColor;
      snapshotContext.fillRect(0, 0, snapshot.width, snapshot.height);
      snapshotContext.drawImage(mosaic, 0, 0);
      if (!dockName) snapshotContext.drawImage(canvas, 0, 0);
      backdrop.style.visibility = "hidden";

      const dockRect = document
        .querySelector<HTMLElement>("[data-name-dock]")
        ?.getBoundingClientRect();
      const largeCell = Math.max(4, Math.min(15, Math.floor((width * 0.88) / COLUMNS.length)));
      const startX = (width - COLUMNS.length * largeCell) / 2;
      const startY = (height - ROWS * largeCell) / 2;
      const dockX = dockRect?.left ?? (width >= 768 ? 40 : 20);
      const dockY = dockRect?.top ?? 24;
      const exitStart = performance.now();
      const reveal = (time: number) => {
        const progress = Math.min(1, (time - exitStart) / EXIT_DURATION);
        context.globalCompositeOperation = "source-over";
        context.clearRect(0, 0, width, height);
        // Fast ease-out: the content appears immediately beneath the wash,
        // then the remaining veil clears without a second content animation.
        context.globalAlpha = Math.pow(1 - progress, 3);
        context.drawImage(snapshot, 0, 0, width, height);
        context.globalAlpha = 1;
        // Keep the moving name above the dissolving backdrop.
        if (dockName) {
          const dockProgress = easeInOutQuad(Math.min(1, (time - exitStart) / DOCK_DURATION));
          const cell = largeCell + (DOCK_CELL - largeCell) * dockProgress;
          const x = startX + (dockX - startX) * dockProgress;
          const y = startY + (dockY - startY) * dockProgress;
          context.fillStyle = "rgb(248, 248, 248)";
          for (let column = 0; column < COLUMNS.length; column++) {
            for (let row = 0; row < ROWS; row++) {
              if (COLUMNS[column]?.[row]) {
                context.fillRect(
                  x + column * cell,
                  y + row * cell,
                  Math.max(1, cell - 1),
                  Math.max(1, cell - 1),
                );
              }
            }
          }
        }
        if (progress < 1 || (dockName && time - exitStart < DOCK_DURATION)) {
          frameId = requestAnimationFrame(reveal);
        } else {
          completedRef.current = true;
          onComplete();
        }
      };
      // Paint the opaque first frame immediately: hiding the DOM backdrop and
      // waiting for another animation frame would flash the page underneath.
      reveal(exitStart);
    };

    const skipIntro = () => startExit();
    const skipOnKey = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey && !event.altKey) skipIntro();
    };

    const resize = () => {
      if (leavingRef.current) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      mosaic.width = canvas.width;
      mosaic.height = canvas.height;
      mosaic.style.width = `${width}px`;
      mosaic.style.height = `${height}px`;
      mosaicContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      if (!start) start = time;
      const elapsed = time - start;

      let invertProgress = 0;
      if (elapsed >= INVERT_END) {
        invertProgress = 1;
      } else if (elapsed > INVERT_START) {
        const rawProgress = (elapsed - INVERT_START) / INVERT_DURATION;
        invertProgress = easeInOutCubic(Math.max(0, Math.min(1, rawProgress)));
      }

      const paper = "rgb(248, 248, 248)";
      const ink = "rgb(15, 15, 15)";
      const background = invertProgress === 1 ? ink : paper;
      const foreground = invertProgress === 1 ? paper : ink;

      const dockRaw = Math.max(0, Math.min(1, (elapsed - DOCK_START) / DOCK_DURATION));
      const dockEase = easeInOutQuad(dockRaw);

      backdrop.style.backgroundColor = background;
      context.clearRect(0, 0, width, height);

      const dock = document.querySelector<HTMLElement>("[data-name-dock]");
      const dockRect = dock?.getBoundingClientRect();
      const dockX = dockRect?.left ?? (width >= 768 ? 40 : 20);
      const dockY = dockRect?.top ?? 24;

      const largeCell = Math.max(4, Math.min(15, Math.floor((width * 0.88) / COLUMNS.length)));
      const smallCell = DOCK_CELL;
      const largeWidth = COLUMNS.length * largeCell;
      const startX = (width - largeWidth) / 2;
      const startY = (height - ROWS * largeCell) / 2;

      const cell = largeCell + (smallCell - largeCell) * dockEase;
      const x = startX + (dockX - startX) * dockEase;
      const y = startY + (dockY - startY) * dockEase;

      // Ring Storm dissolve: a square wave expands from the name's centre. Each tile
      // grows from its own centre, so the still-paper backdrop reads as a border.
      const tile = largeCell * 2;
      const originX = Math.floor(startX);
      const originY = Math.floor(startY);
      const field = getStorm(
        tile,
        originX,
        originY,
        width,
        height,
        startX + largeWidth / 2,
        startY + (ROWS * largeCell) / 2,
      );
      const wavefront = invertProgress * (1 + STORM_BAND);

      mosaicContext.clearRect(0, 0, width, height);
      const inkTiles = new Path2D();
      if (invertProgress > 0 && invertProgress < 1) {
        mosaicContext.fillStyle = ink;
        const tileDevice = Math.round(tile * dpr);
        for (let row = 0; row < field.rows; row++) {
          for (let col = 0; col < field.cols; col++) {
            const threshold = field.t[row * field.cols + col]!;
            const s = (wavefront - threshold) / STORM_BAND;
            if (s <= 0) continue;

            const gridColumn = field.colStart + col;
            const gridRow = field.rowStart + row;

            // Rects are computed in device pixels: CSS-space rounding leaves 1px
            // seams between settled tiles, which read as a pale grid over the ink.
            let left = Math.round((originX + gridColumn * tile) * dpr);
            let top = Math.round((originY + gridRow * tile) * dpr);
            let size = tileDevice + 1; // one device pixel of overlap kills the seam

            if (s < 1) {
              const quantum = Math.max(1, Math.ceil(s * STORM_STEPS)) / STORM_STEPS;
              size = Math.max(1, Math.round(tileDevice * quantum));
              left += Math.round((tileDevice - size) / 2);
              top += Math.round((tileDevice - size) / 2);
            }

            inkTiles.rect(left / dpr, top / dpr, size / dpr, size / dpr);
          }
        }
        mosaicContext.fill(inkTiles);
      }

      context.fillStyle = foreground;
      for (let column = 0; column < COLUMNS.length; column++) {
        const settleAt =
          BUILD_START + (column / Math.max(COLUMNS.length - 1, 1)) * (BUILD_END - BUILD_START);
        const settled = elapsed >= settleAt;
        const columnData = COLUMNS[column] ?? [];

        if (settled) {
          for (let row = 0; row < ROWS; row++) {
            if (columnData[row]) {
              context.fillRect(
                x + column * cell,
                y + row * cell,
                Math.max(1, cell - 1),
                Math.max(1, cell - 1),
              );
            }
          }
        } else if (elapsed > settleAt - 650) {
          const pulse = Math.abs(Math.sin(column * 12.9898 + Math.floor(elapsed / 55) * 0.73));
          const barHeight = 1 + Math.floor(pulse * ROWS);
          context.globalAlpha = 0.18 + pulse * 0.42;
          for (let row = ROWS - barHeight; row < ROWS; row++) {
            context.fillRect(
              x + column * cell,
              y + row * cell,
              Math.max(1, cell - 1),
              Math.max(1, cell - 1),
            );
          }
          context.globalAlpha = 1;
        }
      }

      // Invert only the letter pixels actually covered by a growing ink tile.
      // Reusing the mosaic path keeps the white letters aligned with the fill.
      if (invertProgress > 0 && invertProgress < 1) {
        context.globalCompositeOperation = "source-atop";
        context.fillStyle = paper;
        context.fill(inkTiles);
        context.globalCompositeOperation = "source-over";
      }

      if (!dockRaw && invertProgress < 1) {
        context.font = "10px 'JetBrains Mono', monospace";
        context.fillStyle = foreground;
        const dustCount = Math.min(120, Math.floor((width * height) / 9000));
        const fadeMultiplier = 1 - invertProgress;

        for (let i = 0; i < dustCount; i++) {
          const seed = Math.sin(i * 91.7 + Math.floor(elapsed / 90) * 0.08);
          const px = Math.abs(Math.sin(i * 47.3)) * width;
          const py = Math.abs(Math.cos(i * 31.1)) * height;
          context.globalAlpha = Math.abs(seed) * 0.12 * fadeMultiplier;
          context.fillText([".", ",", "+", "="][i % 4] ?? ".", px, py);
        }
        context.globalAlpha = 1;
      }

      if (elapsed >= DOCK_START) {
        startExit(true);
        return;
      }

      if (!completedRef.current && !leavingRef.current) {
        frameId = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    overlay.addEventListener("click", skipIntro);
    window.addEventListener("keydown", skipOnKey);
    window.addEventListener("wheel", skipIntro, { passive: true });
    window.addEventListener("touchmove", skipIntro, { passive: true });
    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      overlay.removeEventListener("click", skipIntro);
      window.removeEventListener("keydown", skipOnKey);
      window.removeEventListener("wheel", skipIntro);
      window.removeEventListener("touchmove", skipIntro);
    };
  }, [onComplete, onTransitionStart]);

  return (
    <div ref={overlayRef} className="intro-loader" aria-hidden="true">
      <div ref={backdropRef} className="intro-loader__backdrop">
        <canvas ref={mosaicRef} />
      </div>
      <canvas ref={canvasRef} />
      <span className="sr-only">Mathews Shaji</span>
    </div>
  );
}

export function PixelNameMark({ visible }: { visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = COLUMNS.length * DOCK_CELL;
  const height = ROWS * DOCK_CELL;

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    context.fillStyle = "rgb(248, 248, 248)";

    for (let column = 0; column < COLUMNS.length; column++) {
      const columnData = COLUMNS[column] ?? [];
      for (let row = 0; row < ROWS; row++) {
        if (columnData[row]) {
          context.fillRect(
            column * DOCK_CELL,
            row * DOCK_CELL,
            Math.max(1, DOCK_CELL - 1),
            Math.max(1, DOCK_CELL - 1),
          );
        }
      }
    }
  }, [height, width]);

  return (
    <canvas
      ref={canvasRef}
      data-name-dock
      className={`block shrink-0 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ width, height }}
      aria-label="Mathews Shaji"
      role="img"
    />
  );
}
