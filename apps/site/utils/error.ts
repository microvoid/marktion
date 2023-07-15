class CodeError extends Error {
  code = -1;

  constructor(message: string, code = -1) {
    super(message);
    this.name = 'CodeError';
    this.code = code;
  }
}

export function unauthorized() {
  return new CodeError('Unauthorized', 401);
}

export function notFound() {
  return new CodeError('Not Found', 404);
}
