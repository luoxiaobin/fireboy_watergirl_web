import { useState, useEffect, useCallback } from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        // Attempt landscape lock (fails gracefully on unsupported browsers)
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (screen.orientation as any).lock("landscape");
        } catch {
          // Orientation lock not supported — that's fine
        }
      } else {
        await document.exitFullscreen();
        try {
          screen.orientation.unlock();
        } catch {
          // Ignore
        }
      }
    } catch {
      // Fullscreen not supported
    }
  }, []);

  return { isFullscreen, toggleFullscreen };
}
