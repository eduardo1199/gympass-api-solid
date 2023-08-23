export class ResourceNotFountError extends Error {
  constructor(errorMessage: string) {
    super('Error not found: ' + errorMessage)
  }
}
