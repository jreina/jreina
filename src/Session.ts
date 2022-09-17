import { EventEmitter } from "events";
import { Computer } from "./Computer";
import { EventType } from "./const/EventType";
import { InputMode } from "./const/InputMode";
import { SessionStatus } from "./const/SessionStatus";
import { login } from "./std/login";
import { DirectoryNode } from "./types/FileNode";
import { IProgram } from "./types/IProgram";
import { User } from "./types/User";
import { compareSync } from "bcryptjs";
import { getUser } from "./internal/data/UserData";
/**
 * Handles everything for an individual session.
 */
export class Session {
  private _feedback = new EventEmitter();
  private _user!: User;
  private _status = SessionStatus.Idle;
  private _inputMode = InputMode.Public;

  constructor(public cwd: DirectoryNode, public computer: Computer) {
    this._feedback.on(EventType.stdin, this._processInput);
  }

  public get inputMode() {
    return this._inputMode;
  }

  public set inputMode(value: InputMode) {
    this._inputMode = value;
    this._feedback.emit(EventType.inputModeChange, value);
  }

  /**
   * Send a message to stdout
   */
  stdout = (message: string) => {
    this._feedback.emit(EventType.stdout, message);
  };

  /**
   * Send a message to stderr
   */
  stderr = (message: string) => {
    this._feedback.emit(EventType.stderr, message);
  };

  /**
   * Send a message from stdin
   */
  stdin = (message: string) => {
    this._feedback.emit(EventType.stdin, message);
  };

  on = (event: EventType, handler: (arg: any) => void) => {
    this._feedback.on(event, handler);
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
    stderr?: (message: string) => void,
    stdin?: (message: string) => void
  ) {
    if (stdout) {
      this._feedback.on(EventType.stdout, (message) => {
        stdout(message);
      });
    }
    if (stderr) {
      this._feedback.on(EventType.stderr, (message) => {
        stderr(message);
      });
    }
    if (stdin) {
      this._feedback.on(EventType.stdin, (message) => {
        stdin(message);
      });
    }
  }

  public listenOnce(
    stdout?: (message: string) => void,
    stderr?: (message: string) => void,
    stdin?: (message: string) => void
  ) {
    if (stdout) {
      this._feedback.once(EventType.stdout, (message) => {
        stdout(message);
      });
    }
    if (stderr) {
      this._feedback.once(EventType.stderr, (message) => {
        stderr(message);
      });
    }
    if (stdin) {
      this._feedback.once(EventType.stdin, (message) => {
        stdin(message);
      });
    }
  }

  public get user() {
    return this._user;
  }

  public path = [];

  private _processInput = (input: string) => {
    if (this._status !== SessionStatus.Idle) {
      return;
    }
    const [command, ...args] = input.split(" ");
    const builtin = this.computer.bins.get(command);
    if (builtin) {
      this._executeFn(builtin, args);
    } else {
      this.stderr(`${command}: command not found`);
    }
    this._awaitInput();
  };

  private async _executeFn(prog: IProgram, args: Array<string>) {
    this._status = SessionStatus.Busy;
    await prog(this, ...args);
    this._status = SessionStatus.Idle;
  }

  private _awaitInput() {
    const sessionPrompt = this._user
      ? `${this._user.username}@${this.computer.hostname}`
      : "";
    this.stdout(`${sessionPrompt} ${this.cwd.path}> `);
  }

  public async init() {
    this.stdout(this.computer.header);
    await this._executeFn(login, []);
    this._awaitInput();
  }
  private _loginAttempts = 0;
  public login(username: string, password: string): boolean {
    if (this._loginAttempts >= 3) {
      this.stderr("Too many authentication failures");
      this._close();
    }
    const user = getUser(this, username);
    if (!user) {
      this._loginAttempts++;
      return false;
    }

    const isCorrectPassword = compareSync(password, user.password);

    if (isCorrectPassword) {
      this._user = {
        created: new Date(),
        groups: [user.username, "sudo"],
        username: user.username,
      };
      return true;
    }

    this._loginAttempts++;
    return false;
  }

  private _close() {
    this._feedback.removeAllListeners();
  }
}
