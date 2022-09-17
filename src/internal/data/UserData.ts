import { FileNodeType } from "../../const/FileNodeType";
import { Session } from "../../Session";
import { UserPasswdRecord } from "../../types/UserPasswdRecord";
import { resolvePath } from "../../utils/_resolvePath";

function parsePasswd(data: string) {
  const lines = data
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => line.split(":"))
    .map(([username, password, uid, gid, gecos, homeDir, shell]) => ({
      username,
      password,
      uid,
      gid,
      gecos,
      homeDir,
      shell,
    }));
  return lines;
}

export function getUser(
  session: Session,
  username: string
): UserPasswdRecord | null {
  const passwordFile = resolvePath(session.cwd, "/etc/passwd");
  if (!passwordFile || passwordFile.type === FileNodeType.Directory) {
    session.stderr("Missing /etc/passwd");
    session.exit();
    return null;
  }

  const users = parsePasswd(passwordFile.data);
  const user = users.find((user) => user.username === username);

  return user ?? null;
}
