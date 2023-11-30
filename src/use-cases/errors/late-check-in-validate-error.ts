export class LateCheckInValidate extends Error {
  constructor() {
    super('The check-in can only be validated until 20 minutes on created.')
  }
}
