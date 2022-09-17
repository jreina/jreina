import { IProgram } from "../types/IProgram";
import { getfile } from "../utils/_getFile";

export const rm: IProgram = (session, name) => {
  const cwd = session.cwd;
  const target = getfile(cwd, name);
  if (!target) {
    session.stdout(`No such file: ${name}`);
    return session.exit();
  }
  cwd.files.splice(cwd.files.indexOf(target), 1);
  session.exit();
};
