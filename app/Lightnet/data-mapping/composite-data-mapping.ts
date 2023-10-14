import { DataMapping } from './data-mapping';
import { DataBuffer } from './data-buffer';
import { HashArray } from './hash-array';

export abstract class CompositeDataMapping<TDataMappingType extends object> extends DataMapping<TDataMappingType> {
  public readonly mappings: HashArray<keyof TDataMappingType, DataMapping<any>> = new HashArray();

  constructor(dataBuffer: DataBuffer) {
    super(dataBuffer);

    this.setUp();
  }

  setUp(): this {
    return this;
  }

  has(mapping: DataMapping<any>): boolean {
    return this.mappings.hasData(mapping);
  }

  resizeParentBy(size: number) {
    this.endOffset += size;

    let parentComposite: DataMapping<any> | undefined = this;

    do {
      parentComposite = parentComposite.getPrev();

      if (parentComposite instanceof CompositeDataMapping && parentComposite.has(this)) {
        parentComposite.resizeParentBy(size);

        return;
      }
    } while (parentComposite);
  }

  getTerminalMapping(): DataMapping<any> {
    let mapping = this.mappings.last() || this;

    if (mapping !== this && mapping instanceof CompositeDataMapping) {
      mapping = mapping.getTerminalMapping();
    }

    return mapping;
  }

  getMapping<T extends DataMapping<any>>(name: keyof TDataMappingType): T {
    return this.mappings.find(name) as T;
  }

  pushMapping(name: keyof TDataMappingType, mapping: DataMapping<any>) {
    // even inserted mapping start offset with end offset of current mapping
    mapping.moveBy(this.getEndOffset() - mapping.getStartOffset());

    // find terminal element of current mapping
    const terminalMapping = this.getTerminalMapping();

    // find new terminal element of inserted mapping
    const newTerminalMapping = mapping instanceof CompositeDataMapping
      ? mapping.getTerminalMapping()
      : mapping;

    // move everything after terminal element
    if (terminalMapping.getNext()) {
      terminalMapping.getNext().moveBy(mapping.getSize());
    }
    // connect mappings ends
    mapping.setPrev(terminalMapping);
    newTerminalMapping.setNext(terminalMapping.getNext());
    terminalMapping.setNext(mapping);

    if (newTerminalMapping.getNext()) {
      newTerminalMapping.getNext().setPrev(newTerminalMapping);
    }

    // expand current and parent composite mappings by size of pushed mapping
    this.resizeParentBy(mapping.getSize());

    // finally save mapping
    this.mappings.push(name, mapping);
  }

  removeMapping(name: keyof TDataMappingType) {
    if (!this.mappings.has(name)) {
      throw new Error(`Mapping key does not exist: ${String(name)}`);
    }

    const removedMapping = this.mappings.find(name);

    if (removedMapping.getPrev()) {
      removedMapping.getPrev().setNext(removedMapping.getNext());
    }

    if (removedMapping.getNext()) {
      removedMapping.getNext().setPrev(removedMapping.getPrev());
      removedMapping.getNext().moveBy(-removedMapping.getSize());
    }

    this.resizeParentBy(-removedMapping.getSize());

    this.mappings.delete(name);
  }

  getValue(): TDataMappingType {
    const value = {} as TDataMappingType;

    for (const [ name, mapping ] of this.mappings) {
      value[ name ] = mapping.getValue();
    }

    return value;
  }

  setValue(value: Partial<TDataMappingType>) {
    for (const [ name, mapping ] of this.mappings) {
      if (typeof value[ name ] !== 'undefined') {
        mapping.setValue(value[ name ]);
      }
    }
  }

  calculateSizeForValue(value: TDataMappingType): number {
    let size = 0;

    for (const [ name, mapping ] of this.mappings) {
      size += mapping.calculateSizeForValue(value && value[ name ] || null);
    }

    return size;
  }
}
