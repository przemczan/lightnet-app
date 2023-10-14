export class HashArray<K extends string, V> implements Iterable<[ K, V ]> {
  protected items: { name: K, data: V }[] = [];

  * [ Symbol.iterator ](): Iterator<[ K, V ]> {
    for (let index = 0; index < this.items.length; index++) {
      yield [ this.items[ index ].name, this.items[ index ].data ];
    }
  }

  push(name: K, data: V) {
    this.items.push({ name, data });
  }

  last(): V | null {
    return this.items.length ? this.items[ this.items.length - 1 ].data : null;
  }


  find(name: K): V | null {
    const index = this.findIndex(name);

    return this.items[ index ] ? this.items[ index ].data : null;
  }


  hasData(data: V): boolean {
    return this.items.findIndex(item => item.data === data) >= 0;
  }

  delete(name: K) {
    const index = this.findIndex(name);

    this.items.splice(index, 1);
  }

  length() {
    return this.items.length;
  }

  has(name: K) {
    return this.findIndex(name) >= 0;
  }

  protected findIndex(name: K): number {
    return this.items.findIndex(data => data.name === name);
  }
}
