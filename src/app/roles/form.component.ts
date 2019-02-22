import { Component, OnInit } from '@angular/core';
import { Rol } from './rol';
import { RolService } from './rol.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private rol: Rol = new Rol();
  titulo: string = "Crear rol";

  errores: string[];

  constructor(private rolService: RolService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = +params.get('id');
      if (id) {
        this.rolService.getRol(id).subscribe((rol) => this.rol = rol);
      }
    });
  }

  create(): void {
    console.log(this.rol);
    this.rolService.create(this.rol)
      .subscribe(
        rol => {
          this.router.navigate(['/roles']);
          swal('Nuevo rol', `El rol ${rol.nombre} ha sido creado con éxito`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      );
  }

  update(): void {
    console.log(this.rol);
    this.rolService.update(this.rol)
      .subscribe(
        json => {
          this.router.navigate(['/roles']);
          swal('rol Actualizado', `${json.mensaje}: ${json.rol.nombre}`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      )
  }

}
