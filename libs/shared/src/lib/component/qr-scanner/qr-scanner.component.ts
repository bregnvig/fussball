import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'sha-qr-scanner',
  template: `
    <zxing-scanner #webScanner
                *ngIf="scanning"
                [(device)]="currentDevice"
                [tryHarder]="true"
                (camerasFound)="onCamerasFound($event)"
                (scanSuccess)="webScanFoundItem($event)">
    </zxing-scanner>
  `,
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent {

  @Output() scanResult = new EventEmitter<string>();

  scanning = true;
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;

    if (this.availableDevices && this.availableDevices.length > 0) {
      this.currentDevice = this.availableDevices[0];
    }
  }

  webScanFoundItem(scanResult: string) {
    this.scanResult.emit(scanResult)
  }

}
