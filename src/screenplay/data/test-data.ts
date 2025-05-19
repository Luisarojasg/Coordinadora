import { GuiaData } from '../interfaces/guia-data';
import { GUIA_CONSTANTS } from '../constants/guia-constants';

export function createValidGuiaData(): GuiaData {
  return {
    identificacion: "890904713",
    divisionCliente: "00",
    idProceso: 100001,
    codigoPais: 170,
    valoracion: "200000",
    tipoCuenta: 3,
    contenido: "reloj",
    nivelServicio: 22,
    detalle: [
      {
        pesoReal: 1,
        largo: 5,
        ancho: 5,
        alto: 3,
        unidades: 1,
        ubl: 0,
        referencia: "ref detalle"
      }
    ],
    datosRemitente: {
      detalleRemitente: "Casa",
      tipoViaRemitente: "7",
      viaRemitente: "15",
      numeroRemitente: "53 48",
      codigoCiudadRemitente: "76001000",
      descripcionTipoViaRemitente: "Calle",
      direccionRemitente: "Calle 53 # 53 48",
      nombreRemitente: "Remitente Prueba",
      indicativoRemitente: "57",
      celularRemitente: "3007876543",
      correoRemitente: "pruebaremitente@coo.com"
    },
    datosDestinatario: {
      detalleDestinatario: "Casa",
      tipoViaDestinatario: "5",
      viaDestinatario: "15",
      numeroDestinatario: "45 93",
      descripcionTipoViaDestinatario: "Calle",
      direccionDestinatario: "calle 45 93",
      codigoCiudadDestinatario: "76001000",
      nombreDestinatario: "Destinatario Prueba",
      indicativoDestinatario: "57",
      celularDestinatario: "3216549825",
      correoDestinatario: "pruebadestinatario@coor.com"
    },
    valorRecaudar: "0",
    referenciaRecaudo: "REF-001",
    tipoGuia: 1,
    referenciaGuia: "Ref guia 1",
    usuario: "prueba@coordinaora.com",
    fuente: "envios",
    observaciones: "prueba"
  };
}

export function createInvalidGuiaData(): GuiaData {
  return {
    ...createValidGuiaData(),
    identificacion: "", // Invalid empty identification
    datosRemitente: {
      ...createValidGuiaData().datosRemitente,
      correoRemitente: "invalid-email" // Invalid email format
    }
  };
}

export function createValidRecaudoGuiaData(): GuiaData {
  return {
    ...createValidGuiaData(),
    valorRecaudar: "38500",
    referenciaRecaudo: "pedido-insta123",
    observaciones: "prueba RCE"
  };
}

export function createInvalidRecaudoGuiaData(): GuiaData[] {
  return [
    {
      ...createValidGuiaData(),
      valorRecaudar: "0",
      referenciaRecaudo: "",
      observaciones: "prueba RCE - missing required fields"
    },
    {
      ...createValidGuiaData(),
      valorRecaudar: "38500",
      referenciaRecaudo: "a".repeat(51), // Too long reference
      observaciones: "prueba RCE - reference too long"
    },
    {
      ...createValidGuiaData(),
      valorRecaudar: "0", // Below minimum
      referenciaRecaudo: "pedido-insta123",
      observaciones: "prueba RCE - value below minimum"
    },
    {
      ...createValidGuiaData(),
      valorRecaudar: "1000000000", // Above maximum
      referenciaRecaudo: "pedido-insta123",
      observaciones: "prueba RCE - value above maximum"
    }
  ];
} 