import { NgIfContext } from '@angular/common';
import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PlayerFacade } from '@fussball/api';
import { combineLatest, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[shaHasRole]'
})
export class HasRoleDirective {

  private elseTemplateRef: TemplateRef<NgIfContext> | null = null;
  private thenViewRef: EmbeddedViewRef<NgIfContext> | null = null;
  private elseViewRef: EmbeddedViewRef<NgIfContext> | null = null;
  private condition = false;
  private role$ = new Subject<string[]>();

  constructor(
    readonly service: PlayerFacade,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {
    combineLatest([
      service.player$.pipe(filter(p => !!p)),
      this.role$
    ]).subscribe(([player, roles]) => {
      this.condition = (player.roles || []).some(r => roles.some(role => role === r));
      this.updateView();
    });
  }

  @Input()
  set shaHasRoleElse(templateRef: TemplateRef<any> | null) {
    this.elseTemplateRef = templateRef;
    this.elseViewRef = null;  // clear previous view if any.
    this.updateView();
  }

  @Input() set shaHasRole(roles: string | string[]) {
    this.role$.next(Array.isArray(roles) ? roles : [roles]);
  }

  private updateView() {
    if (this.condition) {
      if (!this.thenViewRef) {
        this.viewContainer.clear();
        this.elseViewRef = null;
        this.thenViewRef = this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      if (!this.elseViewRef) {
        this.viewContainer.clear();
        this.thenViewRef = null;
        if (this.elseTemplateRef) {
          this.elseViewRef = this.viewContainer.createEmbeddedView(this.elseTemplateRef);
        }
      }
    }
  }
}
