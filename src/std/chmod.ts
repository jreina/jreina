import { PermissionValue } from "../const/PermissionValue";
import { IProgram } from "../types/IProgram";
import { fileExists } from "../utils/_fileExists";
import { getfile } from "../utils/_getFile";

const pattern = /^([0-7])([0-7])([0-7])$/;

function validatePermissions(perms: string) {
  return pattern.test(perms);
}

function parsePermissions(perms: string) {
  const [, owner, group, others] = pattern.exec(perms) as RegExpExecArray;
  return {
    owner: +owner as PermissionValue,
    group: +group as PermissionValue,
    others: +others as PermissionValue,
  };
}

export const chmod: IProgram = (session, perms, path) => {
  const exists = fileExists(session.cwd, path);
  if (!exists) {
    session.stderr(`No such file: ${path}`);
    return session.exit();
  }
  if (!validatePermissions(perms)) {
    session.stderr(`Invalid permissions: ${perms}`);
    return session.exit();
  }
  const permissions = parsePermissions(perms);

  const target = getfile(session.cwd, path);
  target.permissions = permissions;
  return session.exit();
};
