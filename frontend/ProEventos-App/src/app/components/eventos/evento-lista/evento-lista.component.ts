import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {
  modalRef = {} as BsModalRef;
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public widthImg: number = 150;
  public marginImg: number = 2;
  public showImg: boolean = true;
  private _filtroLista: string = '';
  public get filtroLista(): string {
    return this._filtroLista;
  }
  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista
    ? this.filtrarEventos(this.filtroLista)
    : this.eventos;
  }
  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: { tema: string; local: string }) =>
      evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
      );
    }
    constructor(
      private eventoService: EventoService,
      private modalService: BsModalService,
      private toastr: ToastrService,
      private spinner: NgxSpinnerService,
      private router: Router
      ) {}

      public ngOnInit(): void {
        this.spinner.show();
        this.getEventos();
      }
      public alterarImagem(): void {
        this.showImg = !this.showImg;
      }
      public getEventos(): void {
        this.eventoService.getEventos().subscribe({
          next: (_eventos: Evento[]) => {
            this.eventos = _eventos;
            this.eventosFiltrados = this.eventos;
          },
          error: (error:any) => {
            this.spinner.hide();
            this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
          },
          complete:() => this.spinner.hide()
        });
      }
      openModal(template: TemplateRef<any>):void {
        this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
      }

      confirm(): void {
        this.modalRef.hide();
        this.toastr.success('O Evento foi deletado com Sucesso.', 'Deletado');
      }

      decline(): void {
        this.modalRef.hide();
      }

      detalheEvento(id : number): void{
        this.router.navigate([`eventos/detalhe/${id}`]);
      }
    }
