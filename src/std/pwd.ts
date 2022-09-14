import { Session } from "../Session";
import { IProgram } from "../types/IProgram";

export const pwd: IProgram = (session: Session) => {
  session.stdout(session.cwd.path);
  return session.exit(0);
};
