export class AppError extends Error {
  constructor(public readonly code: string, message: string, public readonly statusCode = 400) {
    super(message);
    this.name = "AppError";
  }
}

export const unauthorized = () => new AppError("UNAUTHORIZED", "Authentication is required.", 401);
export const forbidden = () => new AppError("FORBIDDEN", "You do not have access to this resource.", 403);
