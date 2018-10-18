// ********************************************************
// FILE: db.ts
// PURP: description of database
// ********************************************************

// ********************************************************
// Imports
// ********************************************************


// ********************************************************
// Exports
// ********************************************************

export interface Bounds {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

export interface MapWay {
  // type mask
  t: number;
  // street index, or -1
  s: number;
  // number of nodes
  n: number;
  // nodes indices
  d: number[];
}

export interface DatabaseDescr {
  bounds: Bounds;
  nodes: number[];
  streets: string[];
  ways: MapWay[];
}
