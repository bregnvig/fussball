import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  styleUrls: ['./table-scanner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableScannerComponent {

  error: string;
  detailedError: string;

  tableScanResult(scanResult: string): void {
    this.error = null;
    try {
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
