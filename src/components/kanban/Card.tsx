import styles from "@/styles/kanban.module.css";
import { useSortable } from "@dnd-kit/sortable";
import type { KanbanCard } from "../../types/kanban/cardType";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";

interface CardProps {
  card: KanbanCard;
  columnTitle: string;
  onDelete: (cardId: string) => void;
  onEdit: (cardId: string, title: string) => void;
}

const Card = ({ card, columnTitle, onDelete, onEdit }: CardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(card.title);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    if (!editValue.trim()) return;

    onEdit(card.id, editValue.trim());
    setIsEditing(false);
  };

  useEffect(() => {
    setEditValue(card.title);
  }, [card.title]);

  return (
    <>
      <div
        className={styles.card}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={{ ...style }}
      >
        <div className={styles.cardHeader}>
          {isEditing ? (
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              onBlur={handleSave}
              style={{ fontSize: 16 }}
            />
          ) : (
            <h4
              className={styles.cardTitle}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              {card.title}
            </h4>
          )}
          <button
            className={styles.deleteBtn}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style={{ opacity: 1 }}
            >
              <path
                fill="none"
                d="M14 10v7m-4-7v7M6 6v11.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218h5.606c1.118 0 1.677 0 2.104-.218c.377-.192.683-.498.875-.874c.218-.428.218-.987.218-2.105V6M6 6h2M6 6H4m4 0h8M8 6c0-.932 0-1.398.152-1.765a2 2 0 0 1 1.082-1.083C9.602 3 10.068 3 11 3h2c.932 0 1.398 0 1.765.152a2 2 0 0 1 1.083 1.083C16 4.602 16 5.068 16 6m0 0h2m0 0h2"
              />
            </svg>
          </button>
        </div>
        {card.description && (
          <p className={styles.cardDescription}>{card.description}</p>
        )}
      </div>
    </>
  );
};

export default Card;
