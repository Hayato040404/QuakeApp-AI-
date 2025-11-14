import React, { useState, useRef, useEffect, useCallback } from 'react';

interface DraggableSheetProps {
  headerContent: React.ReactNode;
  children: React.ReactNode;
}

const DraggableSheet: React.FC<DraggableSheetProps> = ({ headerContent, children }) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [minHeight] = useState(100);
  const [maxHeight, setMaxHeight] = useState(window.innerHeight * 0.8);

  useEffect(() => {
    const handleResize = () => {
        setMaxHeight(window.innerHeight * 0.8);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [height, setHeight] = useState(minHeight);
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStartY = useRef(0);
  const initialHeight = useRef(minHeight);

  const handleDragStart = useCallback((clientY: number) => {
    if (!sheetRef.current) return;
    setIsDragging(true);
    dragStartY.current = clientY;
    initialHeight.current = sheetRef.current.clientHeight;
    sheetRef.current.style.transition = 'none';
  }, []);
  
  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    const deltaY = clientY - dragStartY.current;
    let newHeight = initialHeight.current - deltaY;
    
    // Clamp height with some overdrag effect
    if (newHeight < minHeight) newHeight = minHeight - Math.pow(minHeight - newHeight, 0.7);
    if (newHeight > maxHeight) newHeight = maxHeight + Math.pow(newHeight - maxHeight, 0.7);

    setHeight(newHeight);
  }, [isDragging, minHeight, maxHeight]);
  
  const handleDragEnd = useCallback(() => {
    if (!isDragging || !sheetRef.current) return;
    setIsDragging(false);
    sheetRef.current.style.transition = 'height 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
    
    const currentHeight = height;
    // Determine the closest snap point
    const shouldExpand = currentHeight > minHeight + (maxHeight - minHeight) / 2;
    setHeight(shouldExpand ? maxHeight : minHeight);
  }, [isDragging, height, minHeight, maxHeight]);

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    // Prevent sheet drag when scrolling content
    const target = e.target as HTMLElement;
    if (contentRef.current && contentRef.current.contains(target) && contentRef.current.scrollTop > 0) {
        return;
    }
    handleDragStart(e.touches[0].clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientY);
  const onTouchEnd = () => handleDragEnd();

  // Mouse events (for debugging on desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (contentRef.current && contentRef.current.contains(target)) {
        return;
    }
    handleDragStart(e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const handleMouseUp = () => handleDragEnd();

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);
  
  useEffect(() => {
    if (contentRef.current) {
        // Prevent page scroll when scrolling sheet content at its boundary
        const el = contentRef.current;
        const handleWheel = (e: WheelEvent) => {
            if ((el.scrollTop === 0 && e.deltaY < 0) || (el.scrollHeight - el.scrollTop === el.clientHeight && e.deltaY > 0)) {
                e.preventDefault();
            }
        };
        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => el.removeEventListener('wheel', handleWheel);
    }
  }, []);


  return (
    <div
      ref={sheetRef}
      className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-t-2xl shadow-2xl flex flex-col z-10"
      style={{ height: `${height}px`, touchAction: 'none' }}
    >
      <div
        className="py-3 px-4 cursor-grab flex flex-col items-center shrink-0"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
      >
        <div className="w-10 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mb-2"></div>
        <div className="w-full">{headerContent}</div>
      </div>
      <div ref={contentRef} className="overflow-y-auto flex-grow px-4 pb-4 custom-scrollbar">
        {children}
      </div>
    </div>
  );
};

export default DraggableSheet;