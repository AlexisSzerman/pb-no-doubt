import { useEffect, useState } from "react";

const imageMap = {
  normal: "/player_normal.png",
  happy: "/player_happy.png",
  angry: "/player_angry.png",
  leveling_up: "/level_up_celebration.png",
};

export default function usePlayerImages() {
  const [images, setImages] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadedImages = {};
    let loadedCount = 0;
    const keys = Object.keys(imageMap);

    keys.forEach((state) => {
      const img = new Image();
      img.src = imageMap[state];
      img.onload = () => {
        loadedImages[state] = img;
        loadedCount++;
        if (loadedCount === keys.length) {
          setImages(loadedImages);
          setLoaded(true);
        }
      };
    });
  }, []);

  return { images, loaded };
}
