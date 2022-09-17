import { BASE_PERMISSIONS } from "../const/BaseFileSystem";
import { FileNodeType } from "../const/FileNodeType";
import { IProgram } from "../types/IProgram";

const pattern = /^[-_.a-zA-Z0-9]+$/;

function validateName(name: string) {
  return typeof name === "string" && pattern.test(name);
}

export const mkdir: IProgram = (session, name) => {
  const cwd = session.cwd;
  const isValidName = validateName(name);
  if (!isValidName) {
    session.stderr(
      "Name must contain only numbers, letters, underscores, hyphens, and periods"
    );
    return session.exit();
  }
  const fileExists = cwd.files.some((file) => file.name === name);
  if (fileExists) {
    session.stderr(`File already exists: ${name}`);
    return session.exit();
  }
  cwd.files.push({
    type: FileNodeType.Directory,
    files: [
      {
        ...cwd,
        name: "..",
      },
    ],
    name,
    path: cwd.path === "/" ? `/${name}` : `${cwd.path}/${name}`,
    permissions: BASE_PERMISSIONS,
    created: new Date(),
    group: session.user.groups[0],
    owner: session.user.username,
  });
  return session.exit();
};
