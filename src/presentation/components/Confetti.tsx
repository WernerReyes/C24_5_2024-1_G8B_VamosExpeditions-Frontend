import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";

export const Confetti = () => {
  const [fullHeight, setFullHeight] = useState(window.innerHeight);

  // Update height when the page is scrolled
  useEffect(() => {
    const updateHeight = () => {
      setFullHeight(document.documentElement.scrollHeight);
    };

    updateHeight(); // Set initial height
    window.addEventListener("resize", updateHeight);
    window.addEventListener("scroll", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("scroll", updateHeight);
    };
  }, []);

  return (
    <ReactConfetti
      colors={["#01A3BB", "#F4F6F6", "#01495D"]}
      numberOfPieces={600}

      height={fullHeight}
      gravity={0.1}
      initialVelocityY={20}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        zIndex: 9999,
        pointerEvents: "none", // Ensure clicks pass through
      }}
    />
  );
};
