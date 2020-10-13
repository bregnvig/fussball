import { Component, OnInit } from '@angular/core';

interface TableScanResult {
  table, pos: string;
}

@Component({
  selector: 'fuss-table-scanner',
  templateUrl: './table-scanner.component.html',
  styleUrls: ['./table-scanner.component.scss']
})
export class TableScannerComponent implements OnInit {

  error: string;

  constructor() { }

  ngOnInit(): void {
  }

  tableScanResult(scanResult: string): void {
    try {
      this.error = null;
      const result = JSON.parse(scanResult);
    } catch (error) {
      this.error = 'Noget gik galt. Prøv at scanne igen';
      console.error(error);
    }
  }

}
