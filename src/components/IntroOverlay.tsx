import { useCallback, useState } from "react";
import { IntroName } from "./IntroName";

/**
 * Mounts the canvas intro, then removes itself once the sequence completes.
 * The overlay marks the document ready so the page reveal can start.
 */
export function IntroOverlay() {
  const [done, setDone] = useState(false);

  const handleComplete = useCallback(() => setDone(true), []);

  const handleTransitionStart = useCallback(() => {
    document.documentElement.dataset.intro = "ready";
  }, []);

  if (done) return null;

  return (
    <IntroName
      onComplete={handleComplete}
      onTransitionStart={handleTransitionStart}
    />
  );
}
