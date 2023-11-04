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
