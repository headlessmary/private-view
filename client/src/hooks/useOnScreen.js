import { useEffect, useRef, useState } from "react";

export default function useOnScreen() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });

  useEffect(() => {
    const node = ref.current;

    if (!node) return undefined;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}
