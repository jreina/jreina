import { FileNodeType } from "../const/FileNodeType";
import { Permission, PermissionValue } from "../const/PermissionValue";
import { IProgram } from "../types/IProgram";

export const touch: IProgram = (session, name) => {
  const cwd = session.cwd;
  const fileExists = cwd.files.some((file) => file.name === name);
  if (fileExists) {
    session.stdout(`File already exists: ${name}`);
    return session.exit();
  }
  cwd.files.push({
    type: FileNodeType.Data,
    name,
    path: `${cwd.path}/${name}`,
    data: "",
    permissions: {
      others: Permission.Read,
      group: Permission.Read,
      owner: (Permission.Read & Permission.Write) as PermissionValue,
    },
    group: session.user.groups[0],
    owner: session.user.username,
    created: new Date(),
  });
};
