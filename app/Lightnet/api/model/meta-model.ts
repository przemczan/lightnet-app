import { HeaderModel } from './header-model';

export interface MetaModel {
  header: HeaderModel;
  headerCrc: number;
  payloadCrc: number;
  payloadSize: number;
  payload?: number;
}
