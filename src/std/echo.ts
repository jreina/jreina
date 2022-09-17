import { IProgram } from "../types/IProgram";

export const echo: IProgram = (session, ...args) => {
  session.stdout(args.join(" "));
};
