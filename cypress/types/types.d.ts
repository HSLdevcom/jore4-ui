export type UUID = string;

// Global window interface extension for Cypress testing utilities
declare global {
  interface Window {
    coordinatesToOnScreenPixels?: (
      longitude: number,
      latitude: number,
    ) => { x: number; y: number };
  }
}
