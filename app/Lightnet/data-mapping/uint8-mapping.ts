import { DataMapping } from './data-mapping';
import { DataBuffer } from './data-buffer';

export class Uint8Mapping extends DataMapping<number> {
  constructor(dataBuffer: DataBuffer) {
    super(dataBuffer);

    this.endOffset += 1;
  }

  getValue(): number {
    return this.getData().getUint8(this.startOffset);
  }

  setValue(value: number) {
    this.getData().setUint8(this.startOffset, value);
  }
}
