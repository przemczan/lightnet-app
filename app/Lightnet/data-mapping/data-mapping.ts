import { DataBuffer } from './DataBuffer';

export abstract class DataMapping<TDataMappingType> {
  protected next: DataMapping<any> | undefined;
  protected prev: DataMapping<any> | undefined;
  protected startOffset = 0;
  protected endOffset = 0;

  constructor(protected dataBuffer: DataBuffer) {}

  setNext(mapping: DataMapping<any>) {
    this.next = mapping;
  }

  getNext(): DataMapping<any> | undefined {
    return this.next;
  }

  setPrev(mapping?: DataMapping<any>) {
    this.prev = mapping;
  }

  getPrev(): DataMapping<any> | undefined {
    return this.prev;
  }

  getStartOffset(): number {
    return this.startOffset;
  }

  getEndOffset(): number {
    return this.endOffset;
  }

  moveBy(offset: number) {
    this.startOffset += offset;
    this.endOffset += offset;

    if (this.next) {
      this.next.moveBy(offset);
    }
  }

  getSize(): number {
    return this.endOffset - this.startOffset;
  }

  getData(): DataView {
    return this.dataBuffer.getData();
  }

  hasData(): boolean {
    return this.dataBuffer.hasData();
  }

  calculateSizeForValue(value: TDataMappingType): number {
    return this.getSize();
  }

  abstract getValue(): TDataMappingType;

  abstract setValue(value: TDataMappingType): void;
}
