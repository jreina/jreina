import { DirectoryNode } from "../types/FileNode";
import { getfile } from "./_getFile";

/**
 * Given a directory node, recursively resolve the root of the tree.
 */
export function getRoot(node: DirectoryNode): DirectoryNode {
  const parent = getfile(node, "..");
  if (parent) {
    return getRoot(parent as DirectoryNode);
  }
  return node;
}
