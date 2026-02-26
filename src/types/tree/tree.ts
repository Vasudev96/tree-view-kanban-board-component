export interface TreeNode {
  id: string;
  name: string;
  children: TreeNode[];
  isExpanded: boolean;
  isLoading: boolean;
  hasLoaded: boolean;
}
