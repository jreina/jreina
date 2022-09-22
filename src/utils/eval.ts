import { IProgram } from "../types/IProgram";

export const eeval: IProgram = (session, arg) => {
  const argParts = arg.split(" ");
  const lastArgPart = argParts[argParts.length - 1];
  const suggestion = session.cwd.files.find((file) =>
    file.name.startsWith(lastArgPart)
  );
  if (suggestion) {
    session.receiveKeyStroke(suggestion.name.replace(lastArgPart, ""), {});
  }
};
