import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

const OX_CHARS = ['O', 'X'];
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CHANGE_INTERVAL = 80;
const CHANGE_PROBABILITY = 0.06;

const oxxPattern = [
  '01110011011011011',
  '11011011011011011',
  '11011001110001110',
  '11011000100000100',
  '11011001110001110',
  '11011011011011011',
  '01110011011011011',
];

const PATTERN_COLS = oxxPattern[0].length;
const PATTERN_ROWS = oxxPattern.length;

function getCellSize() {
  const vw = window.innerWidth;
  if (vw <= 480) return 16;
  if (vw <= 768) return 20;
  if (vw <= 1024) return 24;
  return 28;
}

function getCellFontSize() {
  const vw = window.innerWidth;
  if (vw <= 480) return 10;
  if (vw <= 768) return 12;
  if (vw <= 1024) return 14;
  return 17;
}

function getRandomOX() {
  return OX_CHARS[Math.floor(Math.random() * OX_CHARS.length)];
}

function getRandomChar() {
  return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
}

interface CellData {
  element: HTMLDivElement;
  row: number;
  col: number;
  isMasked: boolean;
  letter: string | null;
}

interface MaskCell {
  row: number;
  col: number;
  relCol: number;
  relRow: number;
  element: HTMLDivElement;
}

export function HomePage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<CellData[]>([]);
  const colsRef = useRef(0);
  const rowsRef = useRef(0);
  const letterMasksRef = useRef<Record<string, MaskCell[]>>({ o: [], x1: [], x2: [] });
  const letterShapesRef = useRef<Record<string, { relCol: number; relRow: number }[]>>({ o: [], x1: [], x2: [] });
  const occupiedRef = useRef<string[]>([]);
  const animCompleteRef = useRef(false);
  const intervalRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const extractLetterShapes = useCallback(() => {
    const shapes: Record<string, { relCol: number; relRow: number }[]> = { o: [], x1: [], x2: [] };
    for (let row = 0; row < PATTERN_ROWS; row++) {
      for (let col = 0; col < PATTERN_COLS; col++) {
        if (oxxPattern[row][col] === '1') {
          if (col <= 4) shapes.o.push({ relCol: col, relRow: row });
          else if (col >= 6 && col <= 10) shapes.x1.push({ relCol: col - 6, relRow: row });
          else if (col >= 12 && col <= 16) shapes.x2.push({ relCol: col - 12, relRow: row });
        }
      }
    }
    letterShapesRef.current = shapes;
  }, []);

  const createGrid = useCallback(() => {
    const container = gridRef.current;
    if (!container) return;
    container.innerHTML = '';
    cellsRef.current = [];

    const cellSize = getCellSize();
    const fontSize = getCellFontSize();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const cols = Math.floor(screenWidth / cellSize);
    const rows = Math.floor(screenHeight / cellSize);
    colsRef.current = cols;
    rowsRef.current = rows;

    const patternOffsetCol = Math.floor((cols - PATTERN_COLS) / 2);
    const patternOffsetRow = Math.floor((rows - PATTERN_ROWS) / 2) - 1;

    const masks: Record<string, MaskCell[]> = { o: [], x1: [], x2: [] };

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = document.createElement('div');
        cell.style.position = 'absolute';
        cell.style.left = col * cellSize + 'px';
        cell.style.top = row * cellSize + 'px';
        cell.style.width = cellSize + 'px';
        cell.style.height = cellSize + 'px';
        cell.style.fontSize = fontSize + 'px';
        cell.style.fontFamily = "'JetBrains Mono', monospace";
        cell.style.display = 'flex';
        cell.style.alignItems = 'center';
        cell.style.justifyContent = 'center';
        cell.style.textTransform = 'uppercase';

        const patternRow = row - patternOffsetRow;
        const patternCol = col - patternOffsetCol;
        let isMasked = false;
        let letter: string | null = null;

        if (
          patternRow >= 0 && patternRow < PATTERN_ROWS &&
          patternCol >= 0 && patternCol < PATTERN_COLS &&
          oxxPattern[patternRow][patternCol] === '1'
        ) {
          isMasked = true;
          cell.style.background = '#f8f8fd';
          cell.style.color = '#141414';
          cell.style.fontWeight = '800';
          cell.textContent = getRandomOX();

          if (patternCol <= 4) {
            letter = 'o';
            masks.o.push({ row, col, relCol: patternCol, relRow: patternRow, element: cell });
          } else if (patternCol >= 6 && patternCol <= 10) {
            letter = 'x1';
            masks.x1.push({ row, col, relCol: patternCol - 6, relRow: patternRow, element: cell });
          } else if (patternCol >= 12 && patternCol <= 16) {
            letter = 'x2';
            masks.x2.push({ row, col, relCol: patternCol - 12, relRow: patternRow, element: cell });
          }
        } else {
          cell.style.background = '#141414';
          cell.style.color = 'rgba(255, 255, 255, 0.12)';
          cell.style.fontWeight = '400';
          cell.textContent = getRandomChar();
        }

        container.appendChild(cell);
        cellsRef.current.push({ element: cell, row, col, isMasked, letter });
      }
    }

    letterMasksRef.current = masks;

    if (overlayRef.current) {
      const bottomOfPattern = (patternOffsetRow + PATTERN_ROWS) * cellSize;
      const x1CenterCol = patternOffsetCol + 8;
      const x1CenterX = x1CenterCol * cellSize + cellSize / 2;
      overlayRef.current.style.top = (bottomOfPattern + 48) + 'px';
      overlayRef.current.style.left = x1CenterX + 'px';
      overlayRef.current.style.transform = 'translateX(-50%)';
    }
  }, []);

  const setupHoverAreas = useCallback(() => {
    document.querySelectorAll('.letter-hover-area').forEach(el => el.remove());

    Object.keys(letterMasksRef.current).forEach(letter => {
      const maskCells = letterMasksRef.current[letter];
      if (maskCells.length === 0) return;

      let minRow = Infinity, maxRow = -Infinity, minCol = Infinity, maxCol = -Infinity;
      maskCells.forEach(c => {
        minRow = Math.min(minRow, c.row);
        maxRow = Math.max(maxRow, c.row);
        minCol = Math.min(minCol, c.col);
        maxCol = Math.max(maxCol, c.col);
      });

      const cellSize = getCellSize();
      const hoverArea = document.createElement('div');
      hoverArea.className = 'letter-hover-area';
      hoverArea.style.position = 'fixed';
      hoverArea.style.zIndex = '60';
      hoverArea.style.cursor = 'pointer';
      hoverArea.style.left = minCol * cellSize + 'px';
      hoverArea.style.top = minRow * cellSize + 'px';
      hoverArea.style.width = (maxCol - minCol + 1) * cellSize + 'px';
      hoverArea.style.height = (maxRow - minRow + 1) * cellSize + 'px';

      hoverArea.addEventListener('mouseenter', () => moveLetter(letter));
      document.body.appendChild(hoverArea);
    });
  }, []);

  const moveLetter = useCallback((letter: string) => {
    document.querySelectorAll('.letter-hover-area').forEach(el => el.remove());

    const currentCells = letterMasksRef.current[letter];
    const cols = colsRef.current;
    const rows = rowsRef.current;
    const cells = cellsRef.current;

    currentCells.forEach(cellData => {
      const idx = cellData.row * cols + cellData.col;
      if (idx >= 0 && idx < cells.length) {
        cells[idx].element.style.background = '#141414';
        cells[idx].element.style.color = 'rgba(255, 255, 255, 0.12)';
        cells[idx].element.style.fontWeight = '400';
        cells[idx].element.textContent = getRandomChar();
        cells[idx].isMasked = false;
        cells[idx].letter = null;
      }
    });

    const shape = letterShapesRef.current[letter];
    if (!shape || shape.length === 0) return;

    let maxRelCol = 0, maxRelRow = 0;
    shape.forEach(s => {
      maxRelCol = Math.max(maxRelCol, s.relCol);
      maxRelRow = Math.max(maxRelRow, s.relRow);
    });

    const marginX = 3, marginY = 3;
    const maxCol = cols - maxRelCol - 1 - marginX;
    const maxRow = rows - maxRelRow - 1 - marginY;
    let newCol: number, newRow: number, attempts = 0;
    const occupied = occupiedRef.current;

    do {
      newCol = marginX + Math.floor(Math.random() * Math.max(1, maxCol - marginX));
      newRow = marginY + Math.floor(Math.random() * Math.max(1, maxRow - marginY));
      attempts++;
    } while (
      occupied.includes(`${Math.floor(newCol / 10)}-${Math.floor(newRow / 5)}`) && attempts < 30
    );

    if (occupied.length > 3) occupied.shift();
    occupied.push(`${Math.floor(newCol / 10)}-${Math.floor(newRow / 5)}`);

    const newMaskCells: MaskCell[] = [];
    const shuffled = [...shape].sort(() => Math.random() - 0.5);

    shuffled.forEach((s, index) => {
      const nc = newCol + s.relCol;
      const nr = newRow + s.relRow;
      if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) {
        const cellIndex = nr * cols + nc;
        if (cellIndex >= 0 && cellIndex < cells.length) {
          const target = cells[cellIndex];
          setTimeout(() => {
            target.element.style.background = '#f8f8fd';
            target.element.style.color = '#141414';
            target.element.style.fontWeight = '800';
            target.element.textContent = getRandomOX();
            target.isMasked = true;
            target.letter = letter;
          }, index * 15);

          newMaskCells.push({
            row: nr, col: nc, relCol: s.relCol, relRow: s.relRow, element: target.element,
          });
        }
      }
    });

    letterMasksRef.current[letter] = newMaskCells;

    setTimeout(() => {
      if (animCompleteRef.current) setupHoverAreas();
    }, shuffled.length * 15 + 50);
  }, [setupHoverAreas]);

  const showFinalLinks = useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    el.innerHTML = '';

    const labLink = document.createElement('a');
    labLink.textContent = 'lab';
    labLink.href = '/lab';
    labLink.className = 'oxx-nav-link';
    labLink.addEventListener('click', (e) => { e.preventDefault(); navigate('/lab'); });

    const ampersand = document.createElement('span');
    ampersand.textContent = ' & ';
    ampersand.className = 'oxx-ampersand';

    const studioLink = document.createElement('a');
    studioLink.textContent = 'studio';
    studioLink.href = '/projects';
    studioLink.className = 'oxx-nav-link oxx-link-studio';
    studioLink.addEventListener('click', (e) => { e.preventDefault(); navigate('/projects'); });

    el.appendChild(labLink);
    el.appendChild(ampersand);
    el.appendChild(studioLink);

    setTimeout(() => {
      labLink.classList.add('oxx-animate-in');
      studioLink.classList.add('oxx-animate-in');
    }, 50);

    animCompleteRef.current = true;
    setupHoverAreas();
  }, [navigate, setupHoverAreas]);

  useEffect(() => {
    extractLetterShapes();
    createGrid();

    intervalRef.current = window.setInterval(() => {
      cellsRef.current.forEach(cell => {
        if (Math.random() < CHANGE_PROBABILITY) {
          cell.element.textContent = cell.isMasked ? getRandomOX() : getRandomChar();
        }
      });
    }, CHANGE_INTERVAL);

    setTimeout(() => {
      showFinalLinks();
    }, 500);

    const handleResize = () => {
      clearTimeout((window as any).__oxxResizeTimer);
      (window as any).__oxxResizeTimer = setTimeout(() => {
        createGrid();
        if (animCompleteRef.current) {
          showFinalLinks();
          setupHoverAreas();
        }
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('resize', handleResize);
      document.querySelectorAll('.letter-hover-area').forEach(el => el.remove());
    };
  }, [createGrid, extractLetterShapes, showFinalLinks, setupHoverAreas]);

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[#141414]">
      <style>{`
        .oxx-nav-link {
          color: #f8f8fd;
          text-decoration: none;
          opacity: 0.8;
          transition: opacity 0.3s ease;
          position: relative;
          display: inline-block;
        }
        .oxx-nav-link::after {
          content: '';
          position: absolute;
          bottom: 1px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 85%;
          height: 1px;
          background-color: #f8f8fd;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .oxx-link-studio::after {
          width: 92%;
        }
        .oxx-animate-in::after {
          transform: translateX(-50%) scaleX(1);
        }
        .oxx-typing-text:hover .oxx-nav-link {
          opacity: 0.25;
        }
        .oxx-typing-text:hover .oxx-nav-link::after {
          opacity: 0.25;
        }
        .oxx-typing-text:hover .oxx-nav-link:hover {
          opacity: 1;
        }
        .oxx-typing-text:hover .oxx-nav-link:hover::after {
          transform: translateX(-50%) scaleX(0);
          opacity: 1;
        }
        .oxx-ampersand {
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }
        .oxx-typing-text:hover .oxx-ampersand {
          opacity: 0.4;
        }
      `}</style>
      <h1 className="sr-only">OXX Lab — Algorithmic Design & Research Studio</h1>
      <div ref={gridRef} className="fixed top-0 left-0 w-screen h-screen" />
      <div
        ref={overlayRef}
        className="fixed z-50 flex items-center justify-center"
      >
        <span
          ref={textRef}
          className="oxx-typing-text font-['JetBrains_Mono'] font-bold text-[clamp(16px,2.5vw,26px)] tracking-[clamp(3px,0.5vw,6px)] text-[#f8f8fd] lowercase whitespace-nowrap"
        >
          lab
        </span>
      </div>
    </div>
  );
}
