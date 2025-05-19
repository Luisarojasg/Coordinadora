import { test, expect } from '@playwright/test';
import { CoordinadoraUser, AdminUser } from '../src/screenplay/actors/user-roles';
import { CrearGuia, ConsultarGuia, ValidarReferencia, AnularGuia, ApiResponse } from '../src/screenplay/tasks/guia-tasks';
import { createValidGuiaData, createInvalidGuiaData, createValidRecaudoGuiaData, createInvalidRecaudoGuiaData } from '../src/screenplay/data/test-data';
import { GUIA_CONSTANTS } from '../src/screenplay/constants/guia-constants';

test.describe('Coordinadora API Tests', () => {
  let coordinadoraUser: CoordinadoraUser;
  let adminUser: AdminUser;

  test.beforeEach(async () => {
    coordinadoraUser = await CoordinadoraUser.create();
    adminUser = await AdminUser.create();
  });

  test.afterEach(async () => {
    // Clean up any created resources if needed
  });

  test.describe('Crear Guía', () => {
    test('should create a valid guia successfully', async () => {
      const guiaData = createValidGuiaData();
      const response = await coordinadoraUser.attemptsTo<ApiResponse>(
        new CrearGuia(guiaData)
      );

      expect(response).toBeDefined();
      expect(response.success).toBe(true);
      expect(response.guia).toBeDefined();
      expect(typeof response.guia).toBe('string');
    });

    test('should fail with 400 when creating guia with invalid data', async () => {
      const guiaData = createInvalidGuiaData();
      const response = await coordinadoraUser.attemptsTo<ApiResponse>(
        new CrearGuia(guiaData)
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('HTTP 400');
      expect(response.errors).toBeDefined();
      expect(response.errors?.length).toBeGreaterThan(0);
      expect(response.errors?.[0].code).toBe('BAD_MESSAGE');
    });
  });

  test.describe('Recaudo Contra Entrega', () => {
    test('should fail with 400 when referenciaRecaudo is too long', async () => {
      const guiaData = createInvalidRecaudoGuiaData()[1];
      const response = await coordinadoraUser.attemptsTo<ApiResponse>(
        new CrearGuia(guiaData)
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('HTTP 400');
      expect(response.errors).toBeDefined();
    });

    test('should fail with 400 when valorRecaudar is below minimum', async () => {
      const guiaData = createInvalidRecaudoGuiaData()[2];
      const response = await coordinadoraUser.attemptsTo<ApiResponse>(
        new CrearGuia(guiaData)
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('HTTP 400');
      expect(response.errors).toBeDefined();
    });

    test('should fail with 400 when valorRecaudar is above maximum', async () => {
      const guiaData = createInvalidRecaudoGuiaData()[3];
      const response = await coordinadoraUser.attemptsTo<ApiResponse>(
        new CrearGuia(guiaData)
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('HTTP 400');
      expect(response.errors).toBeDefined();
    });

    test('should fail with 400 when referenciaRecaudo or valorRecaudar is empty', async () => {
      const guiaData = createInvalidRecaudoGuiaData()[0];
      const response = await coordinadoraUser.attemptsTo<ApiResponse>(
        new CrearGuia(guiaData)
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('HTTP 400');
      expect(response.errors).toBeDefined();
    });

    test('should fail with 400 when valorRecaudar is at lower boundary (1)', async () => {
      const guiaData = { ...createValidRecaudoGuiaData(), valorRecaudar: '1' };
      const response = await coordinadoraUser.attemptsTo<ApiResponse>(
        new CrearGuia(guiaData)
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('HTTP 400');
      expect(response.errors).toBeDefined();
      expect(response.errors?.[0].message).toContain('valor a recaudar');
    });

    test('should fail with 400 when valorRecaudar is at upper boundary (16000000)', async () => {
      const guiaData = { ...createValidRecaudoGuiaData(), valorRecaudar: '16000000' };
      const response = await coordinadoraUser.attemptsTo<ApiResponse>(
        new CrearGuia(guiaData)
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('HTTP 400');
      expect(response.errors).toBeDefined();
      expect(response.errors?.[0].message).toContain('valor a recaudar');
    });
  });

  test.describe('Consultar Guía', () => {
    test('should retrieve existing guia information', async () => {
      // First create a guia
      const guiaData = createValidGuiaData();
      const createResponse = await coordinadoraUser.attemptsTo<ApiResponse>(
        new CrearGuia(guiaData)
      );

      expect(createResponse.success).toBe(true);
      expect(createResponse.guia).toBeDefined();

      // Then consult it
      const response = await coordinadoraUser.attemptsTo<ApiResponse>(
        new ConsultarGuia(createResponse.guia!)
      );

      expect(response.success).toBe(true);
      expect(response.datosRemitente).toEqual(guiaData.datosRemitente);
      expect(response.datosDestinatario).toEqual(guiaData.datosDestinatario);
    });

    test('should fail with 400 when consulting non-existent guia', async () => {
      const response = await coordinadoraUser.attemptsTo<ApiResponse>(
        new ConsultarGuia('NONEXISTENT')
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('HTTP 400');
      expect(response.errors?.[0].code).toBe('BAD_MESSAGE');
      expect(response.errors?.[0].message).toContain('no encontrada');
    });
  });

  test.describe('Validar Referencia', () => {
    test('should validate existing reference', async () => {
      // First create a guia with reference
      const guiaData = createValidGuiaData();
      const createResponse = await coordinadoraUser.attemptsTo<ApiResponse>(
        new CrearGuia(guiaData)
      );

      expect(createResponse.success).toBe(true);

      const response = await coordinadoraUser.attemptsTo<ApiResponse>(
        new ValidarReferencia(guiaData.referenciaGuia)
      );

      expect(response.success).toBe(true);
      expect(response.valid).toBe(true);
    });

    test('should fail with 400 when validating non-existent reference', async () => {
      const response = await coordinadoraUser.attemptsTo<ApiResponse>(
        new ValidarReferencia('NONEXISTENT')
      );

      expect(response.success).toBe(false);
      expect(response.error).toContain('HTTP 400');
      expect(response.errors?.[0].code).toBe('BAD_MESSAGE');
      expect(response.valid).toBe(false);
    });
  });
}); 