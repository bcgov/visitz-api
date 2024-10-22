class EnumTypeError extends TypeError {
  constructor(msg: string) {
    const message = `Value '${msg}' not in enum.`;
    super(message);
    Object.setPrototypeOf(this, TypeError.prototype);
  }
}

export { EnumTypeError };
