import { FileNodeType } from "../const/FileNodeType";
import { PermissionValue } from "../const/PermissionValue";

export type PermissionSet = {
  owner: PermissionValue;
  group: PermissionValue;
  others: PermissionValue;
};

export type INode = {
  path: string;
  name: string;
  owner: string;
  /**
   * Group owner of the file.
   */
  group: string;
  created: Date;
  permissions: PermissionSet;
};

export type FileNode =
  | (INode & {
      type: FileNodeType.Directory;
      files: Array<FileNode>;
    })
  | (INode & {
      type: FileNodeType.Data;
      data: string;
    });

export type DirectoryNode = Extract<FileNode, { type: FileNodeType.Directory }>;
export type DataNode = Extract<FileNode, { type: FileNodeType.Data }>;
