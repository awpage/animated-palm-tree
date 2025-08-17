// Define the type for the parameter of the inner function
type ErrorDetails = {
  message?: string;
  data?: any;
};

// Define the return type of the inner function
// type CreateErrorFunction = (details: ErrorDetails) => Error; // Adjust this type if needed

// Define the type for the outer function
type ErrFunction = (statusCode: number) => (details: ErrorDetails) => Error;

// Implement the err function with type annotations
export const err: ErrFunction = (statusCode) => {
  return ({ message, data }: ErrorDetails) => {
    return createError({
      statusCode,
      statusMessage: message,
      data,
    });
  };
};

export const HttpErrors:
  | { UNAUTHORIZED: any; SERVER: any; CONFLICT: any }
  | any = {
  /** User does not have permission to see this resource */
  UNAUTHORIZED: err(401),
  /** A server error was encountered that the user should not know about */
  SERVER: err(500),
  /** What the user provided is conflicting with another resource, user should verify */
  CONFLICT: err(409),
  NOT_FOUND: err(404),
  PAYMENT_REQUIRED: err(402),
};
