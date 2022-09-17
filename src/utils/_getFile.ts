import { DirectoryNode, FileNode } from "../types/FileNode";

export const getfile = (node: DirectoryNode, path: string) =>
  node.files.find((file) => file.name === path) as FileNode;
