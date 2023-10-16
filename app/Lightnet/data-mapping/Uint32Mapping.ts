import { DataMapping } from './data-mapping';
import { DataBuffer } from './DataBuffer';

export class Uint32Mapping extends DataMapping<number> {
  constructor(dataBuffer: DataBuffer) {
    super(dataBuffer);

    this.endOffset += 4;
  }

  getValue(): number {
    return this.getData().getUint32(this.startOffset, true);
  }

  setValue(value: number) {
    this.getData().setUint32(this.startOffset, value, true);
  }
}
