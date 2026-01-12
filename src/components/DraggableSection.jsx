import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Copy, Trash, ArrowUp, ArrowDown } from 'lucide-react';

const DraggableSection = ({ id, children, isEditing, onDelete, onDuplicate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative',
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
    border: isEditing ? '2px dashed #ccc' : 'none',
    margin: isEditing ? '20px 0' : '0',
    borderRadius: isEditing ? '10px' : '0',
    background: isEditing ? 'rgba(255,255,255,0.5)' : 'transparent',
  };

  return (
    <div ref={setNodeRef} style={style}>
       {children}
       
       {isEditing && (
         <div className="section-controls">
            <div className="drag-handle" {...attributes} {...listeners} title="Kéo để sắp xếp">
               <GripVertical size={20} />
            </div>
            <div className="action-buttons">
                <button onClick={() => onDuplicate(id)} title="Nhân bản" className="ctrl-btn copy">
                    <Copy size={16} />
                </button>
                <button onClick={() => onDelete(id)} title="Xóa" className="ctrl-btn delete">
                    <Trash size={16} />
                </button>
            </div>
            <div className="section-label">
                {id.split('-')[0].toUpperCase()}
            </div>
         </div>
       )}
    </div>
  );
};

export default DraggableSection;
