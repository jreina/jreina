import { DirectoryNode } from "../types/FileNode";

export const fileExists = (node: DirectoryNode, path: string) =>
  node.files.some((file) => file.name === path);
