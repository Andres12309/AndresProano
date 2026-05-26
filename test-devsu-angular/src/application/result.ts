export type Result<T> =
  | { success: true; value: T }
  | { success: false; error: string };

export const ok = <T>(value: T): Result<T> => ({ success: true, value });

export const fail = <T = never>(error: string): Result<T> => ({
  success: false,
  error,
});

export async function tryCatch<T>(
  action: () => Promise<T>,
  fallback: string
): Promise<Result<T>> {
  try {
    return ok(await action());
  } catch (error) {
    if (error instanceof Error && error.message) return fail(error.message);
    return fail(fallback);
  }
}
