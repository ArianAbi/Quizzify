import { useRef, useEffect } from "react";

export default function AnimatedContainer({
  children,
  className,
  duration,
}: {
  children: React.ReactNode;
  className?: string;
  duration: string;
}) {
  const heightMask = useRef<any>();
  const content = useRef<any>();

  useEffect(() => {
    if (!content.current) return;
    if (!heightMask.current) return;

    heightMask.current.style.maxHeight = `${content.current.clientHeight}px`;
    heightMask.current.style.minHeight = `${content.current.clientHeight}px`;

    heightMask.current.style.minWidth = `${content.current.clientWidth}px`;
    heightMask.current.style.maxWidth = `${content.current.clientWidth}px`;
  }, [children]);

  return (
    <div
      className={`overflow-hidden relative min-h-[20px] min-w-[100px] ${className}`}
      style={{
        transition: `min-height max-height min-width max-width ease`,
        transitionDuration: duration,
      }}
      ref={heightMask}
    >
      <div
        ref={content}
        className="flex flex-col gap-4 p-4 text-nowrap transition-all items-center justify-center absolute top-0 left-2/4 -translate-x-2/4"
      >
        {children}
      </div>
    </div>
  );
}
