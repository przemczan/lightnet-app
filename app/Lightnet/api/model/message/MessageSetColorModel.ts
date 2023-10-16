import { MessageMetaModel } from './MessageMetaModel';
import { ColorRgbModel } from '../ColorRgbModel';

export interface MessageSetColorModel extends MessageMetaModel {
  address: number;
  color: ColorRgbModel;
}
