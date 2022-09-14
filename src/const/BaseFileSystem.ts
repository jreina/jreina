import { FileNode } from "../types/FileNode";
import { FileNodeType } from "./FileNodeType";
import { Permission } from "./PermissionValue";

export const BASE_PERMISSIONS = {
  others: Permission.Read,
  group: Permission.Read,
  owner: Permission.Read,
};
export const BASE_FS: FileNode = {
  type: FileNodeType.Directory,
  path: "/",
  name: "/",
  permissions: BASE_PERMISSIONS,
  files: [
    {
      type: FileNodeType.Directory,
      files: [],
      name: "bin",
      path: "",
      permissions: BASE_PERMISSIONS,
    },
    {
      type: FileNodeType.Directory,
      files: [],
      name: "dev",
      path: "",
      permissions: BASE_PERMISSIONS,
    },
    {
      type: FileNodeType.Directory,
      files: [],
      name: "etc",
      path: "",
      permissions: BASE_PERMISSIONS,
    },
    {
      type: FileNodeType.Directory,
      files: [
        {
          type: FileNodeType.Directory,
          files: [],
          name: "johnny",
          path: "",
          permissions: BASE_PERMISSIONS,
        },
        {
          type: FileNodeType.Directory,
          files: [],
          name: "root",
          path: "",
          permissions: BASE_PERMISSIONS,
        },
      ],
      name: "home",
      path: "",
      permissions: BASE_PERMISSIONS,
    },
    {
      type: FileNodeType.Directory,
      files: [],
      name: "lib",
      path: "",
      permissions: BASE_PERMISSIONS,
    },
    {
      type: FileNodeType.Directory,
      files: [],
      name: "media",
      path: "",
      permissions: BASE_PERMISSIONS,
    },
    {
      type: FileNodeType.Directory,
      files: [],
      name: "proc",
      path: "",
      permissions: BASE_PERMISSIONS,
    },
    {
      type: FileNodeType.Directory,
      files: [],
      name: "tmp",
      path: "",
      permissions: BASE_PERMISSIONS,
    },
    {
      type: FileNodeType.Directory,
      files: [],
      name: "usr",
      path: "",
      permissions: BASE_PERMISSIONS,
    },
    {
      type: FileNodeType.Directory,
      files: [],
      name: "var",
      path: "",
      permissions: BASE_PERMISSIONS,
    },
  ],
};

function addReverseLinks(dir: FileNode, previousPath = "") {
  if (dir.type === FileNodeType.Directory) {
    dir.files.forEach((file) => {
      const path = previousPath + "/" + file.name;
      addReverseLinks(file, path);
      if (file.type === FileNodeType.Directory) {
        file.path = path;
        file.files.push({
          ...dir,
          type: FileNodeType.Directory,
          name: "..",
          path: previousPath,
        });
      }
    });
  }
}

addReverseLinks(BASE_FS);
