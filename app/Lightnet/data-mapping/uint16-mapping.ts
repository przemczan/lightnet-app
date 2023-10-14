import { DataMapping } from './data-mapping';
import { DataBuffer } from './data-buffer';

export class Uint16Mapping extends DataMapping<number> {
  constructor(dataBuffer: DataBuffer) {
    super(dataBuffer);

    this.endOffset += 2;
  }

  getValue(): number {
    return this.getData().getUint16(this.startOffset, true);
  }

  setValue(value: number) {
    this.getData().setUint16(this.startOffset, value, true);
  }
}
