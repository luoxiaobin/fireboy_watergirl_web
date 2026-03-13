import { useState, useEffect, useCallback } from "react";

// Detect iOS (iPhone/iPad/iPod)
const getIsIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const isIOS = getIsIOS();

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
    // iOS Safari doesn't support the Fullscreen API
    if (isIOS) {
      setShowIOSPrompt(true);
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (screen.orientation as any).lock("landscape");
        } catch {
          // Orientation lock not supported
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
  }, [isIOS]);

  const dismissIOSPrompt = useCallback(() => {
    setShowIOSPrompt(false);
  }, []);

  return { isFullscreen, toggleFullscreen, isIOS, showIOSPrompt, dismissIOSPrompt };
}

