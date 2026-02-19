import type { FieldValues, Resolver } from 'react-hook-form';
import type { z } from 'zod';

type ZodIssue = {
  path: (string | number)[];
  message: string;
  code?: string;
};

export function customFormResolver<T extends FieldValues>(
  schema: z.ZodType<T>
): Resolver<T> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);
    if (result.success) {
      return { values: result.data as T, errors: {} };
    }
    const err = result.error;
    const issues =
      'issues' in err
        ? (err as { issues: ZodIssue[] }).issues
        : ([] as ZodIssue[]);
    const errors: Record<string, { message: string; type: string }> = {};
    for (const issue of issues) {
      const path = Array.isArray(issue.path)
        ? issue.path.join('.')
        : String(issue.path);
      if (!path) continue;
      if (!errors[path]) {
        errors[path] = {
          message: issue.message ?? 'Invalid',
          type: issue.code ?? 'custom',
        };
      }
    }
    return { values: {} as T, errors } as Awaited<ReturnType<Resolver<T>>>;
  };
}
