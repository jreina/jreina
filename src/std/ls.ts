import { IProgram } from "../types/IProgram";

export const ls: IProgram = (session) => {
  const files = session.cwd.files
    .map(
      (file) =>
        `${file.name}\t\t${file.permissions.owner}${file.permissions.group}${file.permissions.others}`
    )
    .sort()
    .join("\n");
  session.stdout(files);
  session.stdout("\n");
  session.exit();
};
