import { Component, OnInit } from '@angular/core';
import { isPosition, Position } from '@fussball/data';

interface TableScanResult {
  table: string; 
  pos: Position;
}

function assertTableScanResult(result: TableScanResult): asserts result is TableScanResult {
  if(!result.table) {
    throw new Error('table prop not found');
  }
  if(!result.table) {
    throw new Error('pos prop not found');
  }
  if(!isPosition(result.pos)) {
    throw new Error(`pos ${result.pos} is not a valid position`);
  }
}

@Component({
  selector: 'fuss-table-scanner',
  templateUrl: './table-scanner.component.html',
  styleUrls: ['./table-scanner.component.scss']
})
export class TableScannerComponent implements OnInit {

  error: string;
  detailedError: string;

  constructor() { }

  ngOnInit(): void {
  }

  tableScanResult(scanResult: string): void {
    try {
      this.error = null;
      const result: TableScanResult = JSON.parse(scanResult);
      assertTableScanResult(result);
      console.log(result);
    } catch (error) {
      this.error = 'Noget gik galt. Prøv at scanne igen';
      this.detailedError = error.message;
      console.error(error);
    }
  }

}
