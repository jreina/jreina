import { FileNodeType } from "../const/FileNodeType";
import { DirectoryNode, FileNode } from "../types/FileNode";
import { getfile } from "./_getFile";

/**
 * Given a node and a path, returns the node relative to the given node.
 */
export function resolvePath(
  node: DirectoryNode,
  path: string
): FileNode | null {
  const pathSegments = path.split("/");
  const result = pathSegments.reduce<FileNode | null>(
    (previousNode, segment) => {
      if (!previousNode || previousNode.type === FileNodeType.Data) {
        return null;
      }

      const target = getfile(previousNode, segment);
      if (!target) {
        return null;
      }

      return target;
    },
    node as FileNode
  );
  return result;
}
