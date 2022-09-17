import { FileNode } from "../types/FileNode";
import { FileNodeType } from "./FileNodeType";
import { Permission, PermissionValue } from "./PermissionValue";

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
  group: "root",
  owner: "root",
  created: new Date(),
  files: [
    {
      type: FileNodeType.Directory,
      files: [],
      name: "bin",
      path: "",
      permissions: BASE_PERMISSIONS,
      group: "root",
      owner: "root",
      created: new Date(),
    },
    {
      type: FileNodeType.Directory,
      files: [],
      name: "dev",
      path: "",
      permissions: BASE_PERMISSIONS,
      group: "root",
      owner: "root",
      created: new Date(),
    },
    {
      type: FileNodeType.Directory,
      files: [
        {
          type: FileNodeType.Data,
          created: new Date(),
          data: "johnny:$2b$10$JPUr/b61ZgPNi2LNcOHGDO0u7i33ROi2GHn2NikVMKEgG.rzKPeMi:9:15::/home/johnny:/bin/three\nroot:$2a$10$S6HWkeI10e95FzVd3uuPM.hrg8yrMivA9faCcHcZm2mlWQ3AQvGAO:0:0::/home/root:/bin/three\nguest:$2a$10$7k9Dr444IC3beSerfi0nbeiAWMcUtF4.q/b.Xey.fj2/1m0omAbA6:441:414::/home/guest/bin/three",
          group: "root",
          owner: "root",
          name: "passwd",
          path: "",
          permissions: {
            owner: (Permission.Read | Permission.Write) as PermissionValue,
            group: Permission.Read,
            others: Permission.Read,
          },
        },
      ],
      name: "etc",
      path: "",
      permissions: BASE_PERMISSIONS,
      group: "root",
      owner: "root",
      created: new Date(),
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
          group: "johnny",
          owner: "johnny",
          created: new Date(),
        },
        {
          type: FileNodeType.Directory,
          files: [],
          name: "root",
          path: "",
          permissions: BASE_PERMISSIONS,
          group: "root",
          owner: "root",
          created: new Date(),
        },
        {
          type: FileNodeType.Directory,
          files: [],
          name: "guest",
          path: "",
          permissions: BASE_PERMISSIONS,
          group: "guest",
          owner: "guest",
          created: new Date(),
        },
      ],
      name: "home",
      path: "",
      permissions: BASE_PERMISSIONS,
      group: "root",
      owner: "root",
      created: new Date(),
    },
    {
      type: FileNodeType.Directory,
      files: [],
      name: "lib",
      path: "",
      permissions: BASE_PERMISSIONS,
      group: "root",
      owner: "root",
      created: new Date(),
    },
    {
      type: FileNodeType.Directory,
      files: [],
      name: "media",
      path: "",
      permissions: BASE_PERMISSIONS,
      group: "root",
      owner: "root",
      created: new Date(),
    },
    {
      type: FileNodeType.Directory,
      files: [],
      name: "proc",
      path: "",
      permissions: BASE_PERMISSIONS,
      group: "root",
      owner: "root",
      created: new Date(),
    },
    {
      type: FileNodeType.Directory,
      files: [],
      name: "tmp",
      path: "",
      permissions: BASE_PERMISSIONS,
      group: "root",
      owner: "root",
      created: new Date(),
    },
    {
      type: FileNodeType.Directory,
      files: [],
      name: "usr",
      path: "",
      permissions: BASE_PERMISSIONS,
      group: "root",
      owner: "root",
      created: new Date(),
    },
    {
      type: FileNodeType.Directory,
      files: [],
      name: "var",
      path: "",
      permissions: BASE_PERMISSIONS,
      group: "root",
      owner: "root",
      created: new Date(),
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
