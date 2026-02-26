import styles from "@/styles/tree.module.css";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { initialTreeData } from "../../data/treeData";
import type { TreeNode as TreeNodeType } from "../../types/tree/tree";
import TreeNode from "./TreeNode";

const TreeView = () => {
  const [treeData, setTreeData] = useState<TreeNodeType[]>(initialTreeData);

  const toggleNode = (
    nodes: TreeNodeType[],
    targetId: string,
  ): TreeNodeType[] => {
    return nodes.map((node) => {
      if (node.id === targetId)
        return { ...node, isExpanded: !node.isExpanded };
      return { ...node, children: toggleNode(node.children, targetId) };
    });
  };

  const addNode = (
    nodes: TreeNodeType[],
    parentId: string,
    newNode: TreeNodeType,
  ): TreeNodeType[] => {
    return nodes.map((node) => {
      if (node.id === parentId) {
        return {
          ...node,
          isExpanded: true,
          children: [...node.children, newNode],
        };
      }
      return { ...node, children: addNode(node.children, parentId, newNode) };
    });
  };

  const editNode = (
    nodes: TreeNodeType[],
    targetId: string,
    newName: string,
  ): TreeNodeType[] => {
    return nodes.map((node) => {
      if (node.id === targetId) {
        return { ...node, name: newName };
      }

      return {
        ...node,
        children: editNode(node.children, targetId, newName),
      };
    });
  };

  const deleteNode = (
    nodes: TreeNodeType[],
    targetId: string,
  ): TreeNodeType[] => {
    return nodes
      .filter((node) => node.id !== targetId)
      .map((node) => ({
        ...node,
        children: deleteNode(node.children, targetId),
      }));
  };

  const setLoadingState = (
    nodes: TreeNodeType[],
    targetId: string,
    loading: boolean,
  ): TreeNodeType[] => {
    return nodes.map((node) => {
      if (node.id === targetId) {
        return { ...node, isLoading: loading };
      }
      return {
        ...node,
        children: setLoadingState(node.children, targetId, loading),
      };
    });
  };

  const loadChildren = (
    nodes: TreeNodeType[],
    targetId: string,
  ): TreeNodeType[] => {
    return nodes.map((node) => {
      if (node.id === targetId) {
        return {
          ...node,
          isExpanded: true,
          isLoading: false,
          hasLoaded: true,
          children: [
            {
              id: crypto.randomUUID(),
              name: "Lazy File 1",
              children: [],
              isExpanded: false,
              isLoading: false,
              hasLoaded: true,
            },
            {
              id: crypto.randomUUID(),
              name: "Lazy File 2",
              children: [],
              isExpanded: false,
              isLoading: false,
              hasLoaded: true,
            },
          ],
        };
      }

      return {
        ...node,
        children: loadChildren(node.children, targetId),
      };
    });
  };

  const handleToggle = (id: string) => {
    setTreeData((prev) => {
      const findNode = (nodes: TreeNodeType[]): TreeNodeType | null => {
        for (const node of nodes) {
          if (node.id === id) return node;
          const found = findNode(node.children);
          if (found) return found;
        }
        return null;
      };

      const targetNode = findNode(prev);

      if (targetNode && !targetNode.isExpanded && !targetNode.hasLoaded) {
        const loadingState = setLoadingState(prev, id, true);

        setTimeout(() => {
          setTreeData((current) => loadChildren(current, id));
        }, 1500);

        return loadingState;
      }

      return toggleNode(prev, id);
    });
  };

  const handleAddNode = (parentId: string, name: string) => {
    const newNode: TreeNodeType = {
      id: crypto.randomUUID(),
      name,
      children: [],
      isExpanded: false,
      isLoading: false,
      hasLoaded: true,
    };
    setTreeData((prev) => addNode(prev, parentId, newNode));
  };

  const handleEditNode = (id: string, newName: string) => {
    setTreeData((prev) => editNode(prev, id, newName));
  };

  const handleDeleteNode = (id: string) => {
    const confirmed = window.confirm("delete");
    if (!confirmed) return;
    setTreeData((prev) => deleteNode(prev, id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setTreeData((prev) =>
      reorderNodes(prev, String(active.id), String(over.id)),
    );
  };
  const reorderNodes = (
    nodes: TreeNodeType[],
    activeId: string,
    overId: string,
  ): TreeNodeType[] => {
    const activeIndex = nodes.findIndex((n) => n.id === activeId);
    const overIndex = nodes.findIndex((n) => n.id === overId);

    if (activeIndex !== -1 && overIndex !== -1) {
      const updated = [...nodes];
      const [moved] = updated.splice(activeIndex, 1);
      updated.splice(overIndex, 0, moved);
      return updated;
    }

    return nodes.map((node) => ({
      ...node,
      children: reorderNodes(node.children, activeId, overId),
    }));
  };
  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={treeData.map((node) => node.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.treeWrapper}>
            <div className={styles.tree}>
              {treeData.map((node: TreeNodeType) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  onToggle={handleToggle}
                  onAdd={handleAddNode}
                  onDelete={handleDeleteNode}
                  onEdit={handleEditNode}
                />
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
};

export default TreeView;
