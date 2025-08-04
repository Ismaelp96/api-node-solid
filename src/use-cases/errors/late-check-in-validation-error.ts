export class LateCheckInValidatorError extends Error {
  constructor() {
    super("the check-in can only be validated until 20 min of its creation.");
  }
}
