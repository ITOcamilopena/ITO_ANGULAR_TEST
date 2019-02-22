import { Injectable } from '@angular/core';
//import { DatePipe, formatDate } from '@angular/common';
import { Rol } from './rol';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import swal from 'sweetalert2';

import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';

@Injectable()
export class RolService {
  private urlEndPoint: string = 'https://sigma-backend-app.appspot.com/api/administracion/rol';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router,
    private authService: AuthService) { }

  private agregarAuthorizationHeader() {
    let token = this.authService.token;
    console.log('token: ' + JSON.stringify(token));
    
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e): boolean {
    if (e.status == 401) {

      if (this.authService.isAuthenticated()) {
        this.authService.logout();
      }
      this.router.navigate(['/login']);
      return true;
    }

    if (e.status == 403) {
      swal('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`, 'warning');
      this.router.navigate(['/roles']);
      return true;
    }
    return false;
  }

  getRols(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint , { headers: this.agregarAuthorizationHeader() }).pipe(
      map((response: any) => {
        (response as Rol[]).map(itemList => {
          return itemList;
        });
        return response;
      })
    );
  }

  create(rol: Rol): Observable<Rol> {
    return this.http.post(this.urlEndPoint, rol, { headers: this.agregarAuthorizationHeader() })
      .pipe(
        map((response: any) => response.rol as Rol),
        catchError(e => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }

          if (e.status == 400) {
            return throwError(e);
          }

          console.error(e.error.mensaje);
          swal(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  getRol(id): Observable<Rol> {
    return this.http.get<Rol>(`${this.urlEndPoint}/${id}`, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {

        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }

        this.router.navigate(['/roles']);
        console.error(e.error.mensaje);
        swal('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(rol: Rol): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${rol.id}`, rol, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {

        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }

        if (e.status == 400) {
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Rol> {
    return this.http.delete<Rol>(`${this.urlEndPoint}/${id}`, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {

        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

}
