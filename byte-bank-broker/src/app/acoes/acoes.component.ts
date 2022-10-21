import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Acoes } from './modelo/acoes';
import { AcoesService } from './acoes.service';
import { merge, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs/operators';

const AWAIT_TYPING = 300;
@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent {
  acoesInput = new FormControl();
  todasAcoes$ = this.acoesService.getAcoes().pipe(
    tap(() => {
      console.log('Fluxo Inicial');
    })
  );
  filtroPeloInput$ = this.acoesInput.valueChanges.pipe(
    debounceTime(AWAIT_TYPING),
    tap(() => {
      console.log('Fluxo do filtro.');
    }),
    tap(console.log),
    filter(
      (valorDigitado) => valorDigitado.length >= 3 || !valorDigitado.length
    ),
    distinctUntilChanged(), // Prioriza-se na determinada chamada de um serviço, poupá-lo, caso ele já tenha sido chamado anteriormente com os mesmos parâmetros.
    switchMap((valorDigitado) => this.acoesService.getAcoes(valorDigitado))
  );
  acoes$ = merge(this.todasAcoes$, this.filtroPeloInput$);

  constructor(private acoesService: AcoesService) {}
}
