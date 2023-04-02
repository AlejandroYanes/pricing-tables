import { useEffect, useState } from 'react';
import type { DroppableProps } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';

export default function CustomDroppable({ children, ...props }: DroppableProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
}
