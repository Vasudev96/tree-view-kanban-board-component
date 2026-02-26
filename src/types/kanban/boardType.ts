import type { KanbanCard } from "./cardType";
import type { KanbanColumn } from "./columnType";

export interface KanbanBoardData {
  columns: KanbanColumn[];
  cards: Record<string, KanbanCard>;
}
