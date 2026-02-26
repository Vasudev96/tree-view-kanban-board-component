import styles from "@/styles/kanban.module.css";
import type { KanbanColumn } from "../../types/kanban/columnType";
import type { KanbanCard } from "../../types/kanban/cardType";
import Card from "./Card";
import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";

interface ColumnProps {
  column: KanbanColumn;
  cards: KanbanCard[];
  onAddCard: (columnId: string, title: string) => void;
  onDeleteCard: (cardId: string) => void;
  onEditCard: (cardId: string, title: string) => void;
}

const Column = ({
  column,
  cards,
  onAddCard,
  onDeleteCard,
  onEditCard,
}: ColumnProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const handleSubmit = () => {
    if (!newTitle.trim()) return;

    onAddCard(column.id, newTitle.trim());
    setNewTitle("");
    setIsAdding(false);
  };
  return (
    <>
      <div ref={setNodeRef} className={styles.column}>
        <div
          className={`${styles.columnHeader} ${
            column.title === "To Do"
              ? styles.todoHeader
              : column.title === "In Progress"
                ? styles.progressHeader
                : styles.doneHeader
          }`}
        >
          <h3>{column.title}</h3>
          <span className={styles.countBadge}>{cards.length}</span>
        </div>
        {isAdding ? (
          <div style={{ marginTop: 10 }}>
            <input
              className={styles.input}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter card title"
              style={{ width: "100%", padding: 6 }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              autoFocus
            />
            <button className={styles.addBtn} onClick={handleSubmit}>
              Add
            </button>
          </div>
        ) : (
          <button className={styles.addBtn} onClick={() => setIsAdding(true)}>
            + Add Card
          </button>
        )}

        <div className={styles.cardsContainer}>
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              columnTitle={column.title}
              onDelete={onDeleteCard}
              onEdit={onEditCard}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Column;
