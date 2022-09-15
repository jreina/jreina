import { BASE_FS } from "./const/BaseFileSystem";
import { Session } from "./Session";
import { cd } from "./std/cd";
import { chmod } from "./std/chmod";
import { echo } from "./std/echo";
import { ls } from "./std/ls";
import { mkdir } from "./std/mkdir";
import { pwd } from "./std/pwd";
import { rm } from "./std/rm";
import { touch } from "./std/touch";
import { DirectoryNode, FileNode } from "./types/FileNode";
import { IProgram } from "./types/IProgram";

export class Computer {
  private _fs: FileNode = BASE_FS;
  private _sessions: Array<Session> = [];

  public start() {
    const session = new Session(this._fs as DirectoryNode, this);
    this._sessions.push(session);
    return session;
  }

  // TODO - this sucks. make it better
  public bins = new Map<string, IProgram>([
    ["cd", cd],
    ["pwd", pwd],
    ["ls", ls],
    ["mkdir", mkdir],
    ["touch", touch],
    ["chmod", chmod],
    ["rm", rm],
    ["echo", echo],
  ]);

  public header = "Welcome to the\nGibson Supercomputer\nVersion 6.66\n";
  public hostname = "heavymetal";
}
