export interface MessageInterface<T> {
  getUint8Array(): Uint8Array;
  getValue(): T;
  setValue(value: T): void;
}
