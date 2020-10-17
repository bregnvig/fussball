import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TablesService } from '@fussball/api';
import { isPosition, Position } from '@fussball/data';
import { Subject } from 'rxjs';
import { first, mapTo, switchMap } from 'rxjs/operators';

interface TableScanResult {
  table: string;
  pos: Position;
}

function assertTableScanResult(result: TableScanResult): asserts result is TableScanResult {
  if (!result.table) {
    throw new Error('table prop not found');
  }
  if (!result.table) {
    throw new Error('pos prop not found');
  }
  if (!isPosition(result.pos)) {
    throw new Error(`pos ${result.pos} is not a valid position`);
  }
}

@Component({
  selector: 'fuss-table-scanner',
  templateUrl: './table-scanner.component.html',
  styleUrls: ['./table-scanner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableScannerComponent implements OnInit {

  error: string;
  detailedError: string;

  private tableScanResult$ = new Subject<TableScanResult>();

  constructor(private router: Router, private service: TablesService) {
  }

  ngOnInit() {
    this.tableScanResult$.pipe(
      first(),
      switchMap(result => this.service.joinTable(result.table, result.pos).pipe(mapTo(result))),
    ).subscribe(
      (result: TableScanResult) => this.router.navigate(['tables', result.table]),
      (error) => console.error('error', error)
    );
  }

  tableScanResult(scanResult: string): void {
    this.error = null;
    try {
      const result: TableScanResult = { table: scanResult.split('.')[0], pos: scanResult.split('.')[1] as Position };
      assertTableScanResult(result);
      console.log(result);
      this.tableScanResult$.next(result);
    } catch (error) {
      this.error = 'Noget gik galt. Prøv at scanne igen';
      this.detailedError = error.message;
      console.error(error);
    }
  }

}
