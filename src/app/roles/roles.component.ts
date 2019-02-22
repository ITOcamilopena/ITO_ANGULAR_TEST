import { Component, OnInit } from '@angular/core';
import { Rol } from './rol';
import { RolService } from './rol.service';
import { ModalService } from './detalle/modal.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolsComponent implements OnInit {

  roles: Rol[];
  paginador: any;
  rolSeleccionado: Rol;

  constructor(private rolService: RolService,
    private modalService: ModalService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }

      this.rolService.getRols(page)
        .pipe(
          tap(response => {
            (response as Rol[]).forEach(rol => console.log(rol.nombre));
          })
        )
        .subscribe(response => {
          this.roles = response as Rol[];
          this.paginador = response;
        });
    });

    this.modalService.notificarUpload.subscribe(rol => {
      this.roles = this.roles.map(rolOriginal => {
          return rolOriginal;
      })
    })
  }

  delete(rol: Rol): void {
    swal({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al rol ${rol.nombre}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.rolService.delete(rol.id).subscribe(
          () => {
            this.roles = this.roles.filter(cli => cli !== rol)
            swal(
              'Rol Eliminado!',
              `Rol ${rol.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )

      }
    });
  }

  abrirModal(rol: Rol) {
    this.rolSeleccionado = rol;
    this.modalService.abrirModal();
  }

}
