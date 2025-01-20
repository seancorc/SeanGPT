    /**
    * Compute the dot product of two vectors
    */
    export function dotProduct(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += a[i] * b[i];
    }
    return sum;
  }
  
  /**
   * Compute the magnitude (L2 norm) of a vector
   */
  export function magnitude(a: number[]): number {
    return Math.sqrt(dotProduct(a, a));
  }
  
  /**
   * Averages multiple embedding vectors into a single vector.
   */
  export function averageEmbeddings(embeddings: number[][]): number[] {
    // If there's only one embedding, return it
    if (embeddings.length === 1) return embeddings[0];
  
    const length = embeddings[0].length;
    const sumVector = new Array(length).fill(0);
  
    // Sum component-wise
    for (const emb of embeddings) {
      for (let i = 0; i < length; i++) {
        sumVector[i] += emb[i];
      }
    }
    // Divide by total number of embeddings to get average
    for (let i = 0; i < length; i++) {
      sumVector[i] /= embeddings.length;
    }
  
    return sumVector;
  }