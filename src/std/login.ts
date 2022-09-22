import { EventType } from "../const/EventType";
import { InputMode } from "../const/InputMode";
import { Session } from "../Session";
import { IProgram } from "../types/IProgram";

export const login: IProgram = async (session: Session) => {
  if (session.user) {
    session.stderr("User already logged in!");
    session.exit();
  }

  session.stdout("login as: ");
  const username = await new Promise<string>((res) => {
    session.once(EventType.stdin, res);
  });

  session.stdout("password: ");
  session.inputMode = InputMode.Private;
  const password = await new Promise<string>((res) => {
    session.once(EventType.stdin, res);
  });
  session.inputMode = InputMode.Public;

  const success = session.login(username, password);
  if (success) {
    return session.exit();
  } else {
    session.stdout("Access denied");
    await login(session);
  }
};
