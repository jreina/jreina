import { PermissionSet } from "../types/FileNode";
import { IProgram } from "../types/IProgram";
import { formatPerms } from "../utils/_formatPerms";

function printPermissions({ group, others, owner }: PermissionSet): string {
  return [owner, group, others].map(formatPerms).join("");
}

export const ls: IProgram = (session) => {
  const files = session.cwd.files
    .map((file) =>
      [
        printPermissions(file.permissions),
        file.group,
        file.owner,
        file.name,
        file.created.toLocaleString(),
      ].join("\t")
    )
    .sort()
    .join("\n");
  session.stdout(files);
  session.stdout("\n");
  session.exit();
};
