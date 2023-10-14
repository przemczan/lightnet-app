import { Injectable } from '@angular/core';
import { CordovaService } from '../cordova.service';
import { BehaviorSubject, interval, Observable, } from 'rxjs';
import { filter, first, switchMap, take } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { LoggerWrapper } from '../logger.wrapper';

export enum ServiceEventAction {
  ADDED = 'added',
  RESOLVED = 'resolved',
}

export interface Service {
  domain: string;
  type: string;
  name: string;
  port: number;
  hostname: string;
  ipv4Addresses: string[];
  ipv6Addresses: string[];
  txtRecord: any;
}

export interface ServiceEvent {
  action: ServiceEventAction;
  service: Service;
}

@Injectable({
  providedIn: 'root',
})
export class DiscoveryService {
  private readonly type = '_lightnet._tcp.';
  private readonly domain = 'local.';

  private readonly _services$: Observable<Service[]>;
  private readonly servicesSubject = new BehaviorSubject<Service[]>([]);
  private readonly services: Service[] = [];
  private readonly logger: LoggerWrapper;

  constructor(private readonly cordovaService: CordovaService, logger: NGXLogger) {
    this.logger = new LoggerWrapper(logger, DiscoveryService.name);
    this._services$ = this.servicesSubject.asObservable();
    cordovaService.onDeviceReady$
      .pipe(
        filter(ready => ready),
        first(),
        switchMap(() => interval(50)),
        take(20),
        filter(() => !!cordovaService.cordova),
        first()
      )
      .subscribe(() => this.watch());
  }

  get services$() {
    return this._services$;
  }

  private watch(): void {
    const zeroconf = this.cordovaService.cordova.plugins.zeroconf;

    zeroconf.reInit();

    this.logger.debug(`Watching mDNS services [${this.type}][${this.domain}]`);

    zeroconf.watch(this.type, this.domain, (serviceEvent: ServiceEvent) => {
      this.logger.debug('mDNS event:', serviceEvent);

      if (serviceEvent.action === 'resolved') {
        this.updateService(serviceEvent.service);
        this.servicesSubject.next(this.services);
      }
    });
  }

  private updateService(service: Service) {
    const existingIndex = this.services.findIndex(item => item.name === service.name);

    if (existingIndex < 0) {
      this.services.push(service);

      return;
    }

    this.services[ existingIndex ] = service;
  }
}
