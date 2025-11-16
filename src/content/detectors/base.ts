/**
 * Base interface for all anime detectors
 * Each streaming service or platform should implement this interface
 */
export interface AnimeData {
  title?: string;
  episode?: number;
  seasonNumber?: number;
}

export abstract class BaseDetector {
  /**
   * Detect anime data from the current page
   * @returns AnimeData if detected, null otherwise
   */
  abstract detect(): AnimeData | null;

  /**
   * Check if this detector can handle the current page
   * @returns true if this detector should be used for this page
   */
  canHandle(): boolean {
    return true;
  }
}
