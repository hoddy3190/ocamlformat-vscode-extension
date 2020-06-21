import { spawnSync } from "child_process";

export function execOnShell(
  command: string,
  cwd?: string
): { stdout?: string; error?: { kind: string; msg: string } } {
  // use spawnSync not execSync because there is status code of return value
  const res = spawnSync(command, { cwd, shell: true });

  if (res.status !== 0) {
    return {
      stdout: undefined,
      error: { kind: "StatusError", msg: res.stderr.toString() },
    };
  }

  return { stdout: res.stdout.toString(), error: undefined };
}

// use exec instead of execOnShell as possible as you can because shell command needs to be sanitized
export function exec(
  command: string,
  args?: string[],
  cwd?: string
): { stdout?: string; error?: { kind: string; msg: string } } {
  // use spawnSync not execSync because there is status code of return value
  const res = spawnSync(command, args, { cwd, shell: false });

  if (res.error) {
    return {
      stdout: undefined,
      error: { kind: "ExecError", msg: res.error.message },
    };
  }

  if (res.status !== 0) {
    return {
      stdout: undefined,
      error: { kind: "StatusError", msg: res.stderr.toString() },
    };
  }

  return { stdout: res.stdout.toString(), error: undefined };
}
