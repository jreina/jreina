import { FileNodeType } from "../const/FileNodeType";
import { PermissionValue } from "../const/PermissionValue";

export type FileNode =
  | {
      type: FileNodeType.Directory;
      path: string;
      name: string;
      files: Array<FileNode>;
      permissions: {
        owner: PermissionValue;
        group: PermissionValue;
        others: PermissionValue;
      };
    }
  | {
      type: FileNodeType.Data;
      path: string;
      name: string;
      data: string;
      permissions: {
        owner: PermissionValue;
        group: PermissionValue;
        others: PermissionValue;
      };
    };

export type DirectoryNode = Extract<FileNode, { type: FileNodeType.Directory }>;
export type DataNode = Extract<FileNode, { type: FileNodeType.Data }>;
