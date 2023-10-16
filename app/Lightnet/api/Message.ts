import { DataBuffer } from '../data-mapping/DataBuffer';
import { MessageInterface } from './MessageInterface';
import { CompositeDataMapping } from '../data-mapping/CompositeDataMapping';

export abstract class Message<T extends object> implements MessageInterface<T> {
  protected mapping: CompositeDataMapping<T>;
  protected dataBuffer: DataBuffer;

  constructor() {
    this.dataBuffer = new DataBuffer();
    this.mapping = this.createMapping();
  }

  protected abstract createMapping(): CompositeDataMapping<T>;

  loadFromBuffer(buffer: ArrayBuffer) {
    this.dataBuffer.loadFrom(buffer);
  }

  getArrayBuffer(): ArrayBuffer {
    return this.dataBuffer.getData().buffer;
  }

  getDataBuffer(): DataBuffer {
    return this.dataBuffer;
  }

  getValue(): T {
    return this.mapping.getValue();
  }

  getUint8Array(): Uint8Array {
    return this.dataBuffer.asUin8Array();
  }

  setValue(value: T) {
    this.dataBuffer.loadFrom(new ArrayBuffer(this.mapping.calculateSizeForValue(value)));
    this.mapping.setValue(value);
  }
}
