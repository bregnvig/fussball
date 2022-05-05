import { NgIfContext } from '@angular/common';
import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PlayerFacade } from '@fussball/api';
import { truthy } from '@fussball/utils';
import { combineLatest, Subject } from 'rxjs';

@Directive({
  selector: '[fussHasRole]'
})
export class HasRoleDirective {

  private elseTemplateRef: TemplateRef<NgIfContext> | null = null;
  private thenViewRef: EmbeddedViewRef<NgIfContext> | null = null;
  private elseViewRef: EmbeddedViewRef<NgIfContext> | null = null;
  private condition = false;
  private role$ = new Subject<string[]>();

  constructor(
    readonly service: PlayerFacade,
    private templateRef: TemplateRef<NgIfContext>,
    private viewContainer: ViewContainerRef) {
    combineLatest([
      service.player$.pipe(truthy()),
      this.role$
    ]).subscribe(([player, roles]) => {
      this.condition = (player.roles || []).some(r => roles.some(role => role === r));
      this.updateView();
    });
  }

  @Input()
  set fussHasRoleElse(templateRef: TemplateRef<NgIfContext> | null) {
    this.elseTemplateRef = templateRef;
    this.elseViewRef = null;  // clear previous view if any.
    this.updateView();
  }

  @Input() set fussHasRole(roles: string | string[]) {
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
