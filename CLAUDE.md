# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (runs on http://localhost:5173/)
- **Build**: `npm run build` (TypeScript compilation + Vite build)
- **Lint**: `npm run lint` (ESLint)
- **Preview**: `npm run preview` (preview production build)
- **Screenshots**: `npm run screenshot` (automated screenshot capture with Puppeteer)

## Architecture Overview

This is a React TypeScript application that visualizes "A Little Princess" by Frances Hodgson Burnett as an interactive constellation. The app transforms from a simple text input interface into a sophisticated astronomical visualization.

### Key Components

- **App.tsx**: Main application with responsive constellation visualization
- **Constellation component**: SVG-based circular star map with Roman numerals for chapters
- **Legend component**: Two-column legend explaining parts of speech and star meanings
- **Responsive design**: Uses `useMemo` for dynamic sizing based on viewport

### Styling Architecture

- **Tailwind CSS v4** with Vite integration via `@tailwindcss/vite`
- **CSS imports**: Single `@import "tailwindcss"` in `src/index.css`
- **Responsive breakpoints**: Mobile (768px), tablet (1024px), desktop layouts
- **Color scheme**: Deep blue gradient background (`from-blue-950 via-blue-900 to-blue-950`)

### Data Structure

The constellation uses percentage-based positioning within a circular SVG:
- **Chapter stars**: 19 stars with Roman numerals (I-XIX) 
- **Decorative stars**: ~80 additional stars of varying sizes
- **Star sizes**: `large` (6px), `medium` (4px), `small` (2.5px), `tiny` (1.5px)
- **Text content**: Array of first sentences from each chapter

### Screenshot System

Puppeteer-based automated screenshot capture:
- **ES modules**: Scripts use modern import syntax
- **Live development mode**: Interactive command interface
- **Docker support**: Alternative containerized setup available
- **Commands**: screenshot, reload, viewport, evaluate, exit

## Development Notes

- The app is built as ES modules (`"type": "module"` in package.json)
- TypeScript configuration uses strict mode with separate app and node configs
- SVG positioning uses mathematical calculations for star placement within circles
- Responsive text uses curved SVG `textPath` for circular typography