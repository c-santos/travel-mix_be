export class ExternalApiException extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, ExternalApiException.prototype);
  }
}
