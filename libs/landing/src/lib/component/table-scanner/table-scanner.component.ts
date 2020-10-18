import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TablesService } from '@fussball/api';
import { isPosition, Position } from '@fussball/data';
import { of, Subject } from 'rxjs';
import { catchError, debounceTime, filter, mapTo, switchMap, take } from 'rxjs/operators';
import { JoinTableErrorDialogComponent } from '../join-table-error-dialog/join-table-error-dialog.component';

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
  private acceptedError = true;

  constructor(
    private router: Router,
    private service: TablesService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.tableScanResult$.pipe(
      debounceTime(200),
      filter(() => this.acceptedError),
      switchMap(result => this.service.joinTable(result.table, result.pos).pipe(
        mapTo(result),
        catchError((error) => {
          this.acceptedError = false;
          this.openDialog(error.message);
          console.error('error', error);
          return of(null);
        }),
      )),
      filter(x => !!x),
      take(1),
    ).subscribe((result: TableScanResult) => this.router.navigate(['tables', result.table, 'game']));
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

  private openDialog(errorMessage: string): void {
    const dialogRef = this.dialog.open(JoinTableErrorDialogComponent, { width: '250px', data: { errorMessage } });
    dialogRef.afterClosed().subscribe(result => this.acceptedError = true);
  }

}
