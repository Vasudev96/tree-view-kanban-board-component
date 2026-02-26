import type { TreeNode } from "../types/tree/tree";

export const initialTreeData: TreeNode[] = [
  {
    id: "root-1",
    name: "Root 1",
    isExpanded: false,
    isLoading: false,
    hasLoaded: true,
    children: [
      {
        id: "folder-a",
        name: "Folder A",
        isExpanded: false,
        isLoading: false,
        hasLoaded: true,
        children: [
          {
            id: "file-a1",
            name: "File A1",
            isExpanded: false,
            isLoading: false,
            hasLoaded: true,
            children: [],
          },
          {
            id: "file-a2",
            name: "File A2",
            isExpanded: false,
            isLoading: false,
            hasLoaded: true,
            children: [],
          },
        ],
      },
      {
        id: "folder-b",
        name: "Folder B (Lazy Load)",
        isExpanded: false,
        isLoading: false,
        hasLoaded: false,
        children: [],
      },
    ],
  },
  {
    id: "root-2",
    name: "Root 2",
    isExpanded: false,
    isLoading: false,
    hasLoaded: true,
    children: [
      {
        id: "folder-c",
        name: "Folder C",
        isExpanded: false,
        isLoading: false,
        hasLoaded: true,
        children: [
          {
            id: "file-c1",
            name: "File C1",
            isExpanded: false,
            isLoading: false,
            hasLoaded: true,
            children: [],
          },
        ],
      },
    ],
  },
];
