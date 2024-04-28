import { useRef, useLayoutEffect } from "react";

export default function AnimatedContainer({
  children,
  className,
  duration,
  animateOnlyWidth,
}: {
  children: React.ReactNode;
  className?: string;
  duration: string;
  animateOnlyWidth?: boolean;
}) {
  const heightMask = useRef<any>();
  const content = useRef<any>();

  function setDimentions() {
    const paddingX = 50;
    const paddingY = 25;

    console.log(content.current.style.paddingLeft);

    // heightMask.current.style.maxHeight = `${content.current.clientHeight}px`;
    heightMask.current.style.minHeight = `${
      content.current.clientHeight + paddingY
    }px`;

    heightMask.current.style.minWidth = `${content.current.clientWidth}px`;
    heightMask.current.style.maxWidth = `${
      content.current.clientWidth + paddingX
    }px`;
  }

  useLayoutEffect(() => {
    if (!content.current) return;
    if (!heightMask.current) return;

    setDimentions();

    addEventListener("resize", setDimentions);

    return () => {
      removeEventListener("resize", setDimentions);
    };
  }, [children]);

  return (
    <>
      <div
        className={`absolute bg-black mx-4 p-4 min-w-0 min-h-0 max-w-2 max-h-4 overflow-hidden ${className}`}
        style={{
          transition: `min-height max-height min-width max-width ease`,
          transitionDuration: duration,
        }}
        ref={heightMask}
      ></div>

      <div
        ref={content}
        className="flex flex-col gap-4 p-4 items-center justify-center z-10"
      >
        {children}
      </div>
    </>
  );
}
