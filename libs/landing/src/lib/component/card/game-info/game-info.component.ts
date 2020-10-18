import { Component, OnInit } from '@angular/core';
import { TablesService } from '@fussball/api';
import { Table } from '@fussball/data';
import { trackByProperty } from '@fussball/tools';
import { Observable } from 'rxjs';

@Component({
  selector: 'fuss-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit {

  tables$: Observable<Table[]>;
  trackByFn = trackByProperty('name');
  
  constructor(private service: TablesService) { }

  ngOnInit(): void {
    this.tables$ = this.service.tables$;
  }
  

}
