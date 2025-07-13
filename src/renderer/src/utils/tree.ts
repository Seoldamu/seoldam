import { TreeNode } from '@renderer/types/series/type'

const flattenTree = (nodes: TreeNode[]): TreeNode[] => {
  const flattened: TreeNode[] = []

  const traverse = (nodesToTraverse: TreeNode[]) => {
    for (const node of nodesToTraverse) {
      flattened.push(node)
      if (node.children) {
        traverse(node.children)
      }
    }
  }

  traverse(nodes)
  return flattened
}

export default flattenTree
