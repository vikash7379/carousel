import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import "./styles.css";

export const CarouselItem = ({ children, width }) => {
  return (
    <div className="carousel-item" style={{ width: width }}>
      {children}
    </div>
  );
};

function Carousel({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const updateIndex = (newIndex) => {
    if (newIndex < 0) {
      newIndex = React.Children.count(children) - 1;
      // newIndex = 0  // swape becouse we need infinte scroll
    } else if (newIndex >= React.Children.count(children)) {
      // newIndex = React.Children.count(children) - 1;
      newIndex = 0;
    }
    setActiveIndex(newIndex);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => updateIndex(activeIndex + 1),
    onSwipedRight: () => updateIndex(activeIndex - 1),
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        updateIndex(activeIndex + 1);
      }
    }, 1500);
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  });

  return (
    <>
      <div
        {...handlers}
        className="carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="inner"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {React.Children.toArray(children).map((child, index) => {
            return React.cloneElement(child, { width: "100%" });
          })}
          ;
        </div>
        <div className="indicators">
          <button onClick={() => updateIndex(activeIndex - 1)}>Prev</button>
          {React.Children.toArray(children).map((child, index) => {
            return (
              <button
                className={`${index === activeIndex ? "active" : ""}`}
                onClick={() => {
                  updateIndex(index);
                }}
              >
                {index + 1}
              </button>
            );
          })}
          <button onClick={() => updateIndex(activeIndex + 1)}>Next</button>
        </div>
      </div>
    </>
  );
}

export default Carousel;
