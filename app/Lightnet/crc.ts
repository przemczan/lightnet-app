export class Crc {
  static crc16Update(crc: number, byte: number) {
    let i;
    crc ^= byte;

    for (i = 0; i < 8; ++i) {
      if (crc & 1) {
        crc = (crc >> 1) ^ 0xa001;
      } else {
        crc = crc >> 1;
      }
    }
    return crc;
  }

  static crc16(data: ArrayLike<number>, size: number) {
    let crc = 0xffff;
    let idx = 0;

    while (size--) {
      crc = Crc.crc16Update(crc, data[idx++]);
    }

    return crc;
  }
}
