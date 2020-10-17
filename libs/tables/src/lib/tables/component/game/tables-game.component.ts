import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TablesService } from '@fussball/api';
import { Match, Table } from '@fussball/data';
import { shareLatest } from '@fussball/tools';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'fussball-tables-game',
  templateUrl: './tables-game.component.html',
  styleUrls: ['./tables-game.component.scss']
})
export class TablesGameComponent implements OnInit {

  table$: Observable<Table>;
  match$: Observable<Match>;

  constructor(private service: TablesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.table$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.service.table(id)),
      shareLatest(),
    );

    this.match$ = this.table$.pipe(
      map(table => table.game.matches[table.game.matches.length - 1]),
      shareLatest(),
    );
  }
}
