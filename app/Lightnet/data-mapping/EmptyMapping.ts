import { DataMapping } from './data-mapping';

export class EmptyMapping extends DataMapping<number> {
  getValue(): null {
    return null;
  }

  setValue(value: null) {
  }
}
