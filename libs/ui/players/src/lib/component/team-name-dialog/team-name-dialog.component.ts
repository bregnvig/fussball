import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlayersApiService } from '@fussball/api';
import { Team } from '@fussball/data';

@Component({
  templateUrl: './team-name-dialog.component.html',
  styleUrls: ['./team-name-dialog.component.scss']
})
export class TeamNameDialogComponent implements OnInit {

  nameControl: FormControl;

  constructor(
    private service: PlayersApiService,
    private dialogRef: MatDialogRef<TeamNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { team: Team; }) { }

  onRename() {
    this.dialogRef.close(this.service.updateTeamName(this.data.team.players.join('_'), this.nameControl.value).then(() => this.nameControl.value));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.nameControl = new FormControl(this.data.team.name, Validators.required);
  }

}
