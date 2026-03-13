import { useState, useEffect, useRef } from "react";

export function useGameAssets() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    const filenames = [
      "background.png",
      "door.png",
      "fireboy_small.png",
      "gameover.png",
      "greengoo.png",
      "levelCompleted.png",
      "platform.png",
      "watergirl_small.png",
    ];

    let loadedCount = 0;
    let hasFailed = false;

    filenames.forEach((fname) => {
      const img = new Image();
      img.src = `${import.meta.env.BASE_URL}${fname}`;
      img.onload = () => {
        if (hasFailed) return;
        loadedCount++;
        imagesRef.current[fname] = img;
        if (loadedCount === filenames.length) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        hasFailed = true;
        console.error("Failed to load image", fname);
      };
    });
  }, []);

  return { imagesLoaded, imagesRef };
}
