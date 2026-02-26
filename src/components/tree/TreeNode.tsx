import styles from "@/styles/tree.module.css";
import { useState } from "react";
import type { TreeNode as TreeNodeType } from "../../types/tree/tree";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TreeNodeProps {
  node: TreeNodeType;
  depth: number;
  onToggle: (id: string) => void;
  onAdd: (parentId: string, name: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
}

const TreeNode = ({
  node,
  depth,
  onToggle,
  onAdd,
  onDelete,
  onEdit,
}: TreeNodeProps) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(node.name);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isExpandable = node.children.length > 0 || !node.hasLoaded;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={styles.node}
      >
        <div
          className={styles.nodeRow}
          style={{ paddingLeft: `${depth * 20}px` }}
        >
          {isExpandable && (
            <span
              className={styles.expandIcon}
              onClick={() => onToggle(node.id)}
            >
              {node.isExpanded ? "▼ " : "▶ "}
            </span>
          )}
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              autoFocus
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && editValue.trim()) {
                  onEdit(node.id, editValue.trim());
                  setIsEditing(false);
                }
              }}
              onBlur={() => {
                if (editValue.trim()) {
                  onEdit(node.id, editValue.trim());
                }
                setIsEditing(false);
              }}
            />
          ) : (
            <>
              <span {...listeners} className={styles.dragHandle}>
                ⠿
              </span>
              <span
                className={styles.nodeTitle}
                onDoubleClick={() => setIsEditing(true)}
              >
                {node.name}
              </span>
            </>
          )}

          {/* add node button */}
          <button className={styles.addBtn} onClick={() => setIsAdding(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style={{ opacity: 1 }}
            >
              <path fill="none" d="M6 12h6m0 0h6m-6 0v6m0-6V6" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(node.id)}
            className={styles.deleteBtn}
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

        {isAdding && (
          <div
            className={styles.children}
            style={{ paddingLeft: `${(depth + 1) * 20}px` }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputValue.trim()) {
                  onAdd(node.id, inputValue.trim());
                  setInputValue("");
                  setIsAdding(false);
                }
              }}
              autoFocus
            />
          </div>
        )}

        {node.isLoading && (
          <div
            className={styles.children}
            style={{ paddingLeft: `${(depth + 1) * 20}px` }}
          >
            Loading...
          </div>
        )}

        {node.isExpanded && node.children.length > 0 && (
          <SortableContext
            items={node.children.map((child) => child.id)}
            strategy={verticalListSortingStrategy}
          >
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                onToggle={onToggle}
                onAdd={onAdd}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </>
  );
};

export default TreeNode;
