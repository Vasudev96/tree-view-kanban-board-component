import { useState } from "react";
import "./App.css";
import styles from "@/styles/kanban.module.css";
import KanbanBoard from "./components/kanban/KanbanBoard";
import TreeView from "./components/tree/TreeView";

function App() {
  const [view, setView] = useState<"tree" | "kanban">("tree");
  return (
    <>
      <div>
        <div className="switchNav">
          <button className={styles.addBtn} onClick={() => setView("tree")}>
            Tree View
          </button>
          <button className={styles.addBtn} onClick={() => setView("kanban")}>
            Kanban View
          </button>
        </div>
        {view === "tree" && <TreeView />}
        {view === "kanban" && <KanbanBoard />}
      </div>
    </>
  );
}

export default App;
