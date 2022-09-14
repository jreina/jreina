import { BASE_FS } from "./const/BaseFileSystem";
import { Session } from "./Session";
import { cd } from "./std/cd";
import { chmod } from "./std/chmod";
import { ls } from "./std/ls";
import { mkdir } from "./std/mkdir";
import { pwd } from "./std/pwd";
import { rm } from "./std/rm";
import { touch } from "./std/touch";
import { DataNode, DirectoryNode, FileNode } from "./types/FileNode";
import { IProgram } from "./types/IProgram";

export class Computer {
  private _fs: FileNode = BASE_FS;
  // TODO - ideally this should handle multiple sessions?
  private _session = new Session(this._fs as DirectoryNode);

  public listen(
    stdout?: (message: string) => void,
    stderr?: (message: string) => void
  ) {
    this._session.listen(stdout, stderr);
  }

  public start() {
    this._session.stdout("Welcome to the\nGibson Supercomputer\n\n");
    this._awaitInput();
  }

  public input(message: string) {
    this._processInput(message);
  }

  // TODO - this sucks. make it better
  private _bins = new Map<string, IProgram>([
    ["cd", cd],
    ["pwd", pwd],
    ["ls", ls],
    ["mkdir", mkdir],
    ["touch", touch],
    ["chmod", chmod],
    ["rm", rm],
  ]);
  private _executeFn(fn: IProgram, session: Session, args: Array<string>) {
    fn(session, ...args);
  }

  private _executeFile(file: DataNode, session: Session, args: Array<string>) {
    // parse file into function (danger)
    // executeFn
  }

  private _processInput(input: string) {
    const [command, ...args] = input.split(" ");
    const builtin = this._bins.get(command);
    if (builtin) {
      this._executeFn(builtin, this._session, args);
    } else {
      this._session.stderr(`Command not found: ${command}`);
    }
    this._awaitInput();
  }

  private _awaitInput = () => {
    this._session.stdout(`${this._session.cwd.path}> `);
  };
}
