import { BaseError } from 'make-error';

/**
 * Assert the value is `truthy`. Good for defensive programming, especially
 * after enabling `noUncheckedIndexedAccess` in the tsconfig `compilerOptions`.
 */
export function assert(testValue: unknown, message?: string): asserts testValue {
  if (!testValue) {
    throw new AssertionError(message);
  }
}

class AssertionError extends BaseError {
  name = 'AssertionError';
}

/**
 * Creates an object with the null prototype.
 *
 * @param value - the object to create
 */
export function object<Type extends object>(value?: Type): Type {
  return Object.assign(Object.create(null), value);
}

/**
 * Sorts an array while retaining the original order when the compare method
 * identifies the items as equal.
 *
 * `Array.prototype.sort()` is unstable and so values that are the same will
 * jump around in a non deterministic manner. Here I'm using the index as a
 * fallback. If two elements have the same priority the element with the lower
 * index is placed first hence retaining the original order.
 *
 * @param array - the array to sort
 * @param compareFn - compare the two value arguments `a` and `z` - return 0 for
 *                  equal - return number > 0 for a > z - return number < 0 for
 *                  z > a
 */
export function sort<Type>(array: Type[], compareFn: (a: Type, z: Type) => number): Type[] {
  return [...array]
    .map((value, index) => ({ value, index }))
    .sort((a, z) => compareFn(a.value, z.value) || a.index - z.index)
    .map(({ value }) => value);
}

/**
 * Finds all the regex matches for a string
 *
 * @param text - the text to check against
 * @param regexp - the regex (which should include a 'g' flag)
 *
 */
export function findMatches(
  text: string,
  regexp: RegExp,
  runWhile: (match: RegExpExecArray | null) => boolean = match => !!match
): RegExpExecArray[] {
  regexp.lastIndex = 0;

  const results: RegExpExecArray[] = [];
  const flags = regexp.flags;
  let match: RegExpExecArray | null;

  if (!flags.includes('g')) {
    regexp = new RegExp(regexp.source, `g${flags}`);
  }

  do {
    match = regexp.exec(text);

    if (match) {
      results.push(match);
    }
  } while (runWhile(match));

  regexp.lastIndex = 0;
  return results;
}
