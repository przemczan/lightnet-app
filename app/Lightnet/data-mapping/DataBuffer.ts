import { ReplaySubject } from 'rxjs';

export class DataBuffer {
  protected data: DataView | undefined;
  protected uint8Array: Uint8Array | undefined;

  public readonly onChange$: ReplaySubject<DataView | undefined>;

  constructor(data?: DataView | ArrayBuffer) {
    this.onChange$ = new ReplaySubject<DataView | undefined>(1);
    this.loadFrom(data);
  }

  loadFrom(data: ArrayBuffer | DataView | undefined) {
    if (data instanceof ArrayBuffer) {
      data = new DataView(data);
    }

    this.data = data;
    this.uint8Array = new Uint8Array(data ? data.buffer : new ArrayBuffer(0));

    this.onChange$.next(this.data);
  }

  // setSize(size: number) {
  //   const bytesArray = new Uint8Array(new ArrayBuffer(size));
  //
  //   if (this.data) {
  //     bytesArray.set(new Uint8Array(this.data.buffer));
  //   }
  //
  //   this.loadFrom(bytesArray.buffer);
  // }

  hasData(): boolean {
    return !!this.data;
  }

  getData(): DataView {
    if (!this.data) {
      throw new Error('No data in buffer defined');
    }

    return this.data;
  }

  asUin8Array(): Uint8Array {
    return this.uint8Array!;
  }
}
