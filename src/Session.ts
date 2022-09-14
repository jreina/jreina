import { EventEmitter } from "events";
import { DirectoryNode } from "./types/FileNode";

/**
 * Handles everything for an individual session.
 */
export class Session {
  private _feedback = new EventEmitter();
  constructor(public cwd: DirectoryNode) {}

  stdout = (message: string) => {
    this._feedback.emit("stdout", message);
  };

  stderr = (message: string) => {
    this._feedback.emit("stderr", message);
  };

  exit = (code?: number) => {
    if (typeof code === "number" && code !== 0) {
      this.stderr(`Process exited with code (${code})`);
    }
  };

  setCwd = (node: DirectoryNode) => {
    this.cwd = node;
  };

  public listen(
    stdout?: (message: string) => void,
    stderr?: (message: string) => void
  ) {
    if (stdout) {
      this._feedback.on("stdout", (message) => {
        stdout(message);
      });
    }
    if (stderr) {
      this._feedback.on("stderr", (message) => {
        stderr(message);
      });
    }
  }

  public stdin(message: string) {}

  public path = [];
}
