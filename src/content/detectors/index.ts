import { BaseDetector } from './base';
import { CrunchyrollDetector } from './services/crunchyroll';
import { GenericDetector } from './generic';

/**
 * Registry of all available detectors
 * Service-specific detectors are tried first, then falls back to generic detector
 */
class DetectorRegistry {
  private detectors: BaseDetector[] = [
    new CrunchyrollDetector(),
    // Add more service detectors here as they're implemented
    // new NetflixDetector(),
    // new HuluDetector(),
    // new PrimeDetector(),
    // new DisneyHotstarDetector(),
  ];

  private genericDetector = new GenericDetector();

  /**
   * Get appropriate detector for current page
   * @returns The best detector for the current page
   */
  getDetector(): BaseDetector {
    for (const detector of this.detectors) {
      if (detector.canHandle()) {
        return detector;
      }
    }
    return this.genericDetector;
  }

  /**
   * Register a custom detector (for future plugin support)
   * @param detector - The detector instance to register
   */
  registerDetector(detector: BaseDetector): void {
    this.detectors.unshift(detector); // Add to front for priority
  }
}

export const detectorRegistry = new DetectorRegistry();
