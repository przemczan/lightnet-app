import { Message } from '../message';
import { MessageMetaMapping } from '../mapping/message/message-meta-mapping';
import { MessageMetaModel } from '../model/message/message-meta-model';
import { PROTOCOL_VERSION } from '../protocol-version';
import { Crc } from '../../crc';
import { MetaMapping } from '../mapping/meta-mapping';
import { HeaderMapping } from '../mapping/header-mapping';
import { CompositeDataMapping } from '../../data-mapping/composite-data-mapping';
import { Uint16Mapping } from '../../data-mapping/uint16-mapping';

export class MessageMeta<TModel extends MessageMetaModel = MessageMetaModel> extends Message<TModel> {
  static readonly OK = 0;
  static readonly ISVALID_BUFFER_SIZE_MISMATCH = 1;
  static readonly ISVALID_HEADER_CRC_INVALID = 2;
  static readonly ISVALID_PAYLOAD_CRC_INVALID = 3;

  protected metaMapping: MetaMapping;
  protected headerMapping: HeaderMapping;
  protected payloadMapping: Uint16Mapping;

  constructor() {
    super();

    this.metaMapping = this.mapping.getMapping('meta');
    this.headerMapping = this.metaMapping.getMapping('header');
    this.payloadMapping = this.metaMapping.getMapping('payload');

    // @ts-ignore
    this.setValue({
      meta: {
        header: {
          type: 0,
          nonce: Math.random() * 0xFFFFFFFF,
          protocolVersion: PROTOCOL_VERSION,
        },
        headerCrc: 0,
        payloadCrc: 0,
        payloadSize: 0,
      }
    });
  }

  protected createMapping(): CompositeDataMapping<TModel> {
    return new MessageMetaMapping<TModel>(this.dataBuffer);
  }

  updateChecksums() {
    this.metaMapping.getMapping('payloadSize').setValue(this.mapping.getEndOffset() - this.payloadMapping.getEndOffset());
    this.metaMapping.getMapping('headerCrc').setValue(this.calculateHeaderCrc());
    this.metaMapping.getMapping('payloadCrc').setValue(this.calculatePayloadCrc());
  }

  isValid(): number {
    const headerCrc = this.metaMapping.getMapping('headerCrc').getValue();
    const payloadCrc = this.metaMapping.getMapping('payloadCrc').getValue();
    const payloadSize = this.metaMapping.getMapping('payloadSize').getValue();

    if (this.mapping.getSize() + payloadSize !== this.dataBuffer.getData().buffer.byteLength) {
      return MessageMeta.ISVALID_BUFFER_SIZE_MISMATCH;
    }

    if (this.calculateHeaderCrc() !== headerCrc) {
      return MessageMeta.ISVALID_HEADER_CRC_INVALID;
    }

    if (this.calculatePayloadCrc() !== payloadCrc) {
      return MessageMeta.ISVALID_PAYLOAD_CRC_INVALID;
    }

    return MessageMeta.OK;
  }

  getType(): number {
    return this.headerMapping.getMapping('type').getValue();
  }

  protected calculateHeaderCrc(): number {
    const uint8Array = this.getUint8Array();

    return Crc.crc16(
      uint8Array.slice(this.headerMapping.getStartOffset(), this.headerMapping.getEndOffset()),
      this.headerMapping.getSize()
    );
  }

  protected calculatePayloadCrc(): number {
    const uint8Array = this.getUint8Array();
    const payloadSize = this.metaMapping.getMapping('payloadSize').getValue();

    return Crc.crc16(
      uint8Array.slice(this.payloadMapping.getStartOffset(), this.payloadMapping.getEndOffset() + payloadSize),
      payloadSize
    );
  }
}
