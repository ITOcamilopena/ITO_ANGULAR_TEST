import { Component, OnInit, Input } from '@angular/core';
import { Rol } from '../rol';
import { RolService } from '../rol.service';
import { ModalService } from './modal.service';

import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '../../usuarios/auth.service';

@Component({
  selector: 'detalle-rol',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() rol: Rol;

  titulo: string = "Detalle del rol";

  constructor(private rolService: RolService,
    private authService: AuthService,
    private modalService: ModalService) { }

  ngOnInit() { }

  cerrarModal() {
    this.modalService.cerrarModal();
  }

}
