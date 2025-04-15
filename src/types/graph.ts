export interface Node {
    id: number
    x: number
    y: number
    color?: string
    state?: "default" | "visited" | "current" | "path" | "start" | "end"
  }
  
  export interface Edge {
    from: number
    to: number
    weight?: number
  }
  