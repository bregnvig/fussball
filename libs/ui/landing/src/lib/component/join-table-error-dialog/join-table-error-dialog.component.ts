import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'fuss-join-table-error-dialog',
  template: `
    <div mat-dialog-content>
      <h1 mat-dialog-title>Error</h1>
      <p>{{errorMessage}}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close] cdkFocusInitial>Ok</button>
    </div>
  `,
})
export class JoinTableErrorDialogComponent {

  errorMessage: string;

  constructor(
    public dialogRef: MatDialogRef<JoinTableErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { errorMessage: string}) {
      this.errorMessage = data.errorMessage;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
