class EnumTypeError extends TypeError {
  constructor(msg: string) {
    const message = `Value '${msg}' not in enum.`;
    super(message);
    Object.setPrototypeOf(this, EnumTypeError.prototype);
  }
}

export { EnumTypeError };
