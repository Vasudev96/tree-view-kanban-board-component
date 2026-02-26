import styles from "@/styles/kanban.module.css";
import { useState } from "react";
import { initialBoardData } from "../../data/kanbanData";
import type { KanbanBoardData } from "../../types/kanban/boardType";
import Column from "./Column";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const KanbanBoard = () => {
  const [boardData, setBoardData] = useState<KanbanBoardData>(initialBoardData);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    setBoardData((prev) => {
      const sourceCol = prev.columns.find((col) =>
        col.cardIds.includes(activeId),
      );
      const destCol = prev.columns.find(
        (col) => col.cardIds.includes(overId) || col.id === overId,
      );

      if (!sourceCol || !destCol) return prev;

      const oldIndex = sourceCol.cardIds.indexOf(activeId);
      const newIndex = destCol.cardIds.indexOf(overId);

      return {
        ...prev,
        columns: prev.columns.map((col) => {
          if (col.id === sourceCol.id && col.id === destCol.id) {
            return {
              ...col,
              cardIds: arrayMove(col.cardIds, oldIndex, newIndex),
            };
          }

          if (col.id === sourceCol.id) {
            return {
              ...col,
              cardIds: col.cardIds.filter((id) => id !== activeId),
            };
          }

          if (col.id === destCol.id) {
            const insertIndex =
              overId === destCol.id ? col.cardIds.length : newIndex;

            const newIds = [...col.cardIds];
            newIds.splice(insertIndex, 0, activeId);

            return {
              ...col,
              cardIds: newIds,
            };
          }

          return col;
        }),
      };
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleAddCard = (colId: string, title: string) => {
    const newCardId = crypto.randomUUID();

    setBoardData((prev) => {
      const updatedCol = prev.columns.map((col) =>
        col.id === colId
          ? { ...col, cardIds: [...col.cardIds, newCardId] }
          : col,
      );

      return {
        ...prev,
        columns: updatedCol,
        cards: {
          ...prev.cards,
          [newCardId]: {
            id: newCardId,
            title,
          },
        },
      };
    });
  };

  const handleEditCard = (cardId: string, newTitle: string) => {
    setBoardData((prev) => {
      return {
        ...prev,
        cards: {
          ...prev.cards,
          [cardId]: {
            ...prev.cards[cardId],
            title: newTitle,
          },
        },
      };
    });
  };

  const handleDeleteCard = (cardId: string) => {
    setBoardData((prev) => {
      const updatedCol = prev.columns.map((col) => ({
        ...col,
        cardIds: col.cardIds.filter((id) => id !== cardId),
      }));

      const updatedCards = { ...prev.cards };
      delete updatedCards[cardId];

      return {
        ...prev,
        columns: updatedCol,
        cards: updatedCards,
      };
    });
  };

  return (
    <div className={styles.board}>
      <DndContext
        collisionDetection={closestCenter}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.columns}>
          {boardData.columns.map((column) => (
            <SortableContext
              key={column.id}
              items={column.cardIds}
              strategy={verticalListSortingStrategy}
            >
              <Column
                key={column.id}
                column={column}
                cards={column.cardIds.map((cardId) => boardData.cards[cardId])}
                onAddCard={handleAddCard}
                onEditCard={handleEditCard}
                onDeleteCard={handleDeleteCard}
              />
            </SortableContext>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
