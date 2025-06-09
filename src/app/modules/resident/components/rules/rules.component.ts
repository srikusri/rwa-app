import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RulesService } from '../../../core/services/rules.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  rules$: Observable<string[]>;

  constructor(private rulesService: RulesService) {
    this.rules$ = this.rulesService.getRules();
  }

  ngOnInit() {}
}
