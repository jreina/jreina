import { IProgram } from "../types/IProgram";

export const whoami: IProgram = (session) => {
  session.stdout(session.user.username);
  return session.exit();
};
