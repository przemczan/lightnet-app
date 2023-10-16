import { CompositeDataMapping } from './CompositeDataMapping';
import { DataMapping } from './data-mapping';
import { DataBuffer } from './DataBuffer';

export class ArrayDataMapping<TDataMappingType> extends CompositeDataMapping<TDataMappingType[]> {
  protected sampleItem: DataMapping<TDataMappingType>;

  constructor(
    dataBuffer: DataBuffer,
    protected readonly itemMappingCallback: () => DataMapping<TDataMappingType>,
    protected readonly lengthField?: DataMapping<number>,
  ) {
    super(dataBuffer);

    dataBuffer.onChange$.subscribe(() => this.onDataChange());
    this.sampleItem = itemMappingCallback();
  }

  onDataChange() {
    if (this.hasData() && this.lengthField) {
      this.setLength(this.lengthField.getValue());
    }
  }

  setLength(length: number) {
    for (let index = length; index < this.mappings.length(); index++) {
      console.log('removing array item: ', index);
      this.removeMapping(index);
    }

    for (let index = this.mappings.length(); index < length; index++) {
      this.pushMapping(index, this.itemMappingCallback());
    }
  }

  getValue(): TDataMappingType[] {
    const value: TDataMappingType[] = [];

    for (const [index, mapping] of this.mappings) {
      value[index as number] = mapping.getValue();
    }

    return value;
  }

  setValue(value: Partial<TDataMappingType[]> & Array<Partial<TDataMappingType>>) {
    this.setLength(value.length);

    if (this.lengthField) {
      this.lengthField.setValue(value.length);
    }

    for (const [index, mapping] of this.mappings) {
      mapping.setValue(value[index]);
    }
  }

  calculateSizeForValue(value: TDataMappingType[]): number {
    let size = 0;

    if (!Array.isArray(value)) {
      return size;
    }

    for (let index = 0; index < value.length; index++) {
      size += this.sampleItem.calculateSizeForValue(value[index]);
    }

    return size;
  }
}
