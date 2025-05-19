import { Actor } from '../actor';
import { ApiRequest } from './api-request';

export interface DetalleGuia {
  pesoReal: number;
  largo: number;
  ancho: number;
  alto: number;
  unidades: number;
  ubl: number;
  referencia: string;
}

export interface DatosRemitente {
  detalleRemitente: string;
  tipoViaRemitente: string;
  viaRemitente: string;
  numeroRemitente: string;
  codigoCiudadRemitente: string;
  descripcionTipoViaRemitente: string;
  direccionRemitente: string;
  nombreRemitente: string;
  indicativoRemitente: string;
  celularRemitente: string;
  correoRemitente: string;
}

export interface DatosDestinatario {
  detalleDestinatario: string;
  tipoViaDestinatario: string;
  viaDestinatario: string;
  numeroDestinatario: string;
  descripcionTipoViaDestinatario: string;
  direccionDestinatario: string;
  codigoCiudadDestinatario: string;
  nombreDestinatario: string;
  indicativoDestinatario: string;
  celularDestinatario: string;
  correoDestinatario: string;
}

export interface GuiaData {
  identificacion: string;
  divisionCliente: string;
  idProceso: number;
  codigoPais: number;
  valoracion: string;
  tipoCuenta: number;
  contenido: string;
  nivelServicio: number;
  detalle: DetalleGuia[];
  datosRemitente: DatosRemitente;
  datosDestinatario: DatosDestinatario;
  valorRecaudar?: string;
  referenciaRecaudo?: string;
  tipoGuia: number;
  referenciaGuia: string;
  usuario: string;
  fuente: string;
  observaciones: string;
}

export interface ApiResponse {
  success: boolean;
  guia?: string;
  error?: string;
  errors?: any[];
  estado?: string;
  valid?: boolean;
  datosRemitente?: DatosRemitente;
  datosDestinatario?: DatosDestinatario;
  valorRecaudar?: string;
  referenciaRecaudo?: string;
}

export class CrearGuia {
  constructor(private guiaData: GuiaData) {}

  async performAs(actor: Actor): Promise<ApiResponse> {
    return await actor.attemptsTo(
      new ApiRequest('POST', '/guias/cm-guias-ms/guia', this.guiaData)
    );
  }
}

export class ConsultarGuia {
  constructor(private guia: string) {}

  async performAs(actor: Actor): Promise<ApiResponse> {
    return await actor.attemptsTo(
      new ApiRequest('GET', `/guias/cm-guias-ms/guia/${this.guia}`)
    );
  }
}

export class ValidarReferencia {
  constructor(private referencia: string) {}

  async performAs(actor: Actor): Promise<ApiResponse> {
    return await actor.attemptsTo(
      new ApiRequest('GET', `/guias/cm-guias-ms/guia/validar/${this.referencia}`)
    );
  }
}

export class AnularGuia {
  constructor(private guia: string, private motivo: string) {}

  async performAs(actor: Actor): Promise<ApiResponse> {
    return await actor.attemptsTo(
      new ApiRequest('POST', `/guias/cm-guias-ms/guia/${this.guia}/anular`, { 
        motivo: this.motivo
      })
    );
  }
} 