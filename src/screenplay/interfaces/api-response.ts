export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiResponse {
  success: boolean;
  error?: string;
  errors?: ApiError[];
  guia?: string;
  estado?: string;
  valid?: boolean;
  identificacion?: string;
  divisionCliente?: string;
  idProceso?: number;
  codigoPais?: number;
  valoracion?: string;
  tipoCuenta?: number;
  contenido?: string;
  nivelServicio?: number;
  detalle?: {
    pesoReal: number;
    largo: number;
    ancho: number;
    alto: number;
    unidades: number;
    ubl: number;
    referencia: string;
  }[];
  datosRemitente?: {
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
  };
  datosDestinatario?: {
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
  };
  valorRecaudar?: string;
  referenciaRecaudo?: string;
  tipoGuia?: number;
  referenciaGuia?: string;
  usuario?: string;
  fuente?: string;
  observaciones?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  usuarioCreacion?: string;
  usuarioActualizacion?: string;
} 