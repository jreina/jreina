import { Session } from "../Session";

export type IProgram = (
  session: Session,
  ...args: Array<string>
) => Promise<void> | void;
