import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GithubContributor } from '../model/github.model';

@Injectable()
export class GithubService {

  contributors$: Observable<GithubContributor[]>;

  constructor(private http: HttpClient) {
    this.contributors$ = this.http.get<any>('https://api.github.com/repos/bregnvig/fussball/contributors').pipe(
      map((response: any[]) => response.map(r => <GithubContributor>{
        login: r.login,
        avatarURL: r.avatar_url,
        url: r.html_url,
        contributions: r.contributions
      }).sort((a, b) => b.contributions - a.contributions))
    );
  }
}