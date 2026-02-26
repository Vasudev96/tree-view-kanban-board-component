import type { KanbanBoardData } from "../types/kanban/boardType";

export const initialBoardData: KanbanBoardData = {
  cards: {
    "card-1": {
      id: "card-1",
      title: "Create Project",
      description: "React + TypeScript",
    },
    "card-2": {
      id: "card-2",
      title: "Design Landing Page",
    },
    "card-3": {
      id: "card-3",
      title: "Setup Database",
    },
    "card-4": {
      id: "card-4",
      title: "Write API",
    },
  },
  columns: [
    {
      id: "column-todo",
      title: "To Do",
      cardIds: ["card-1", "card-2"],
    },
    {
      id: "column-inprogress",
      title: "In Progress",
      cardIds: ["card-3"],
    },
    {
      id: "column-done",
      title: "Done",
      cardIds: ["card-4"],
    },
  ],
};
