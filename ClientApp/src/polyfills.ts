// src/polyfills.ts
import 'core-js'; // Adds polyfills for ES6+ features
import 'zone.js'; // Required by Angular

// Polyfill for process (if needed)
import * as process from 'process';
(window as any).process = process;