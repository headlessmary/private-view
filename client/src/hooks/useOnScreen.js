import { useEffect, useRef, useState } from "react";

export default function useOnScreen() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: window.innerWidth <= 767 ? 0.05 : 0.15,
        rootMargin: "0px 0px -4% 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}
