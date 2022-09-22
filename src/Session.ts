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
import { eeval } from "./utils/eval";
/**
 * Handles everything for an individual session.
 */
export class Session {
  private _feedback = new EventEmitter();
  private _user!: User;
  private _status = SessionStatus.Idle;
  private _inputMode = InputMode.Public;
  private _buffer = "";

  constructor(public cwd: DirectoryNode, public computer: Computer) {
    this._feedback.on(EventType.stdin, this._processInput);
    this._feedback.on(EventType.stdout, this._appendToBuffer);
    this._feedback.on(EventType.stderr, this._appendToBuffer);
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

  /**
   * Add a listener for an event type.
   */
  on = (event: EventType, handler: (arg: any) => void) => {
    this._feedback.on(event, handler);
  };

  /**
   * Add a one-time listener for an event type.
   */
  once = (event: EventType, handler: (arg: any) => void) => {
    this._feedback.once(event, handler);
  };

  exit = (code?: number) => {
    if (typeof code === "number" && code !== 0) {
      this.stderr(`Process exited with code (${code})`);
    }
  };

  setCwd = (node: DirectoryNode) => {
    this.cwd = node;
  };

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
    this.setStatus(SessionStatus.Busy);
    await prog(this, ...args);
    this.setStatus(SessionStatus.Idle);
  }

  public setStatus(status: SessionStatus) {
    this._status = status;
    this._feedback.emit(EventType.statusChange, this._status);
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

  private _appendToBuffer = (message: string, newLine = true) => {
    if (newLine) {
      this._buffer += "\n";
    }
    const safeToPrintMessage =
      this._inputMode === InputMode.Public
        ? message
        : message.replace(/./g, "*");
    this._buffer += safeToPrintMessage;
    this._feedback.emit(EventType.bufferChange, this._buffer);
  };

  private _inputBuffer = "";

  private _popFromBuffer = () => {
    if (this._inputBuffer.length === 0) {
      return;
    }
    this._buffer = this._buffer.slice(0, -1);
    this._inputBuffer = this._inputBuffer.slice(0, -1);
    this._feedback.emit(EventType.bufferChange, this._buffer);
  };

  public receiveKeyStroke(
    char: string | null,
    special: {
      ctrl?: boolean;
      alt?: boolean;
      enter?: boolean;
      backspace?: boolean;
      meta?: boolean;
      arrowLeft?: boolean;
      arrowRight?: boolean;
      arrowUp?: boolean;
      arrowDown?: boolean;
      tab?: boolean;
      delete?: boolean;
      home?: boolean;
      end?: boolean;
      pageUp?: boolean;
      pageDown?: boolean;
      insert?: boolean;
    }
  ) {
    if (char === null) {
      // handle special characters
      if (special.enter) {
        this.stdin(this._inputBuffer);
        this._inputBuffer = "";
      }
      if (special.backspace) {
        this._popFromBuffer();
      }
      if (special.tab) {
        eeval(this, this._inputBuffer);
      }
      return;
    }

    // handle normal characters
    this._inputBuffer += char;
    this._appendToBuffer(char, false);
  }
}
