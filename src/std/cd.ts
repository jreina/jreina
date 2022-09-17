import { FileNodeType } from "../const/FileNodeType";
import { Session } from "../Session";
import { IProgram } from "../types/IProgram";
import { resolvePath } from "../utils/_resolvePath";

export const cd: IProgram = (session: Session, path: string) => {
  const target = resolvePath(session.cwd, path);

  if (target?.type === FileNodeType.Data) {
    session.stderr(`${path}: Not a directory`);
    return session.exit(1);
  }

  if (!target) {
    session.stderr(`${path}: No such file or directory`);
    return session.exit(1);
  }

  session.setCwd(target);
  return session.exit(0);
};
