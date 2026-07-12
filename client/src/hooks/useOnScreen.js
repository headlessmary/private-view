import { useEffect, useRef, useState } from "react";

export default function useOnScreen() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) return undefined;

    const handleScroll = () => {
      const rect = node.getBoundingClientRect();
      const shouldShow = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

      if (shouldShow) {
        setIsVisible(true);
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return [ref, isVisible];
}
