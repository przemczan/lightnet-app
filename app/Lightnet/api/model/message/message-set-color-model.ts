import { MessageMetaModel } from './message-meta-model';
import { ColorRgbModel } from '../color-rgb-model';

export interface MessageSetColorModel extends MessageMetaModel {
  address: number;
  color: ColorRgbModel;
}
