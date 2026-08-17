import { execFileSync } from 'child_process';

const SHIFT = 1 << 17;
const CONTROL = 1 << 18;
const OPTION = 1 << 19;
const COMMAND = 1 << 20;
export const MAC_MODIFIER_MASK = SHIFT | CONTROL | OPTION | COMMAND;

function execOsascript(args: string[], timeout = 4000): string {
  return execFileSync('osascript', args, {
    encoding: 'utf8',
    timeout
  });
}

export function readMacModifierFlags(): number {
  try {
    const out = execOsascript(
      ['-l', 'JavaScript', '-e', 'ObjC.import("AppKit"); String($.NSEvent.modifierFlags)'],
      1500
    );
    return Number.parseInt(out.trim(), 10) || 0;
  } catch {
    return 0;
  }
}

export async function waitForMacModifiersReleased(timeoutMs = 2000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if ((readMacModifierFlags() & MAC_MODIFIER_MASK) === 0) return;
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
}

export async function copyMacSelection(): Promise<void> {
  await waitForMacModifiersReleased();
  execOsascript(['-e', 'tell application "System Events" to keystroke "c" using command down']);
}

export function formatSelectionError(error: unknown): string {
  const code =
    error && typeof error === 'object' && 'code' in error
      ? String((error as { code?: unknown }).code)
      : '';
  const stderr =
    error && typeof error === 'object' && 'stderr' in error
      ? String((error as { stderr: Buffer | string }).stderr)
      : '';

  if (
    code === 'ETIMEDOUT' ||
    stderr.includes('not allowed') ||
    stderr.includes('(-1743)') ||
    stderr.includes('(1002)')
  ) {
    return 'macOS blocked the copy command. Allow Reword to control System Events when asked, and keep Accessibility enabled.';
  }

  if (stderr.trim()) return stderr.trim().split('\n')[0];
  if (error instanceof Error) return error.message.split('\n')[0];
  return 'Error getting selected text';
}
