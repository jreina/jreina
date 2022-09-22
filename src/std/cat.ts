import { FileNodeType } from "../const/FileNodeType";
import { DataNode } from "../types/FileNode";
import { IProgram } from "../types/IProgram";
import { getfile } from "../utils/_getFile";

export const cat: IProgram = (session, ...args) => {
  if (args.length === 0) {
    session.stderr("Must supply a file or files to cat");
    return session.exit();
  }

  const files = args.map((file) => getfile(session.cwd, file));
  const areAllFiles = files.every((file) => file.type === FileNodeType.Data);
  if (!areAllFiles) {
    session.stderr("Must be a file to cat");
    return session.exit();
  }

  (files as Array<DataNode>).forEach((file) =>
    session.stdout(file.data + "\n")
  );
  return session.exit();
};
