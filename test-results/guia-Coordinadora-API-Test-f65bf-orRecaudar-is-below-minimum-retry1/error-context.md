# Test info

- Name: Coordinadora API Tests >> Recaudo Contra Entrega >> should fail with 400 when valorRecaudar is below minimum
- Location: C:\Users\57320\Desktop\coordinadora\tests\guia.spec.ts:59:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
    at C:\Users\57320\Desktop\coordinadora\tests\guia.spec.ts:65:32
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import { CoordinadoraUser, AdminUser } from '../src/screenplay/actors/user-roles';
   3 | import { CrearGuia, ConsultarGuia, ValidarReferencia, AnularGuia, ApiResponse } from '../src/screenplay/tasks/guia-tasks';
   4 | import { createValidGuiaData, createInvalidGuiaData, createValidRecaudoGuiaData, createInvalidRecaudoGuiaData } from '../src/screenplay/data/test-data';
   5 | import { GUIA_CONSTANTS } from '../src/screenplay/constants/guia-constants';
   6 |
   7 | test.describe('Coordinadora API Tests', () => {
   8 |   let coordinadoraUser: CoordinadoraUser;
   9 |   let adminUser: AdminUser;
   10 |
   11 |   test.beforeEach(async () => {
   12 |     coordinadoraUser = await CoordinadoraUser.create();
   13 |     adminUser = await AdminUser.create();
   14 |   });
   15 |
   16 |   test.afterEach(async () => {
   17 |     // Clean up any created resources if needed
   18 |   });
   19 |
   20 |   test.describe('Crear Guía', () => {
   21 |     test('should create a valid guia successfully', async () => {
   22 |       const guiaData = createValidGuiaData();
   23 |       const response = await coordinadoraUser.attemptsTo<ApiResponse>(
   24 |         new CrearGuia(guiaData)
   25 |       );
   26 |
   27 |       expect(response).toBeDefined();
   28 |       expect(response.success).toBe(true);
   29 |       expect(response.guia).toBeDefined();
   30 |       expect(typeof response.guia).toBe('string');
   31 |     });
   32 |
   33 |     test('should fail with 400 when creating guia with invalid data', async () => {
   34 |       const guiaData = createInvalidGuiaData();
   35 |       const response = await coordinadoraUser.attemptsTo<ApiResponse>(
   36 |         new CrearGuia(guiaData)
   37 |       );
   38 |
   39 |       expect(response.success).toBe(false);
   40 |       expect(response.error).toContain('HTTP 400');
   41 |       expect(response.errors).toBeDefined();
   42 |       expect(response.errors?.length).toBeGreaterThan(0);
   43 |       expect(response.errors?.[0].code).toBe('BAD_MESSAGE');
   44 |     });
   45 |   });
   46 |
   47 |   test.describe('Recaudo Contra Entrega', () => {
   48 |     test('should fail with 400 when referenciaRecaudo is too long', async () => {
   49 |       const guiaData = createInvalidRecaudoGuiaData()[1];
   50 |       const response = await coordinadoraUser.attemptsTo<ApiResponse>(
   51 |         new CrearGuia(guiaData)
   52 |       );
   53 |
   54 |       expect(response.success).toBe(false);
   55 |       expect(response.error).toContain('HTTP 400');
   56 |       expect(response.errors).toBeDefined();
   57 |     });
   58 |
   59 |     test('should fail with 400 when valorRecaudar is below minimum', async () => {
   60 |       const guiaData = createInvalidRecaudoGuiaData()[2];
   61 |       const response = await coordinadoraUser.attemptsTo<ApiResponse>(
   62 |         new CrearGuia(guiaData)
   63 |       );
   64 |
>  65 |       expect(response.success).toBe(false);
      |                                ^ Error: expect(received).toBe(expected) // Object.is equality
   66 |       expect(response.error).toContain('HTTP 400');
   67 |       expect(response.errors).toBeDefined();
   68 |     });
   69 |
   70 |     test('should fail with 400 when valorRecaudar is above maximum', async () => {
   71 |       const guiaData = createInvalidRecaudoGuiaData()[3];
   72 |       const response = await coordinadoraUser.attemptsTo<ApiResponse>(
   73 |         new CrearGuia(guiaData)
   74 |       );
   75 |
   76 |       expect(response.success).toBe(false);
   77 |       expect(response.error).toContain('HTTP 400');
   78 |       expect(response.errors).toBeDefined();
   79 |     });
   80 |
   81 |     test('should fail with 400 when referenciaRecaudo or valorRecaudar is empty', async () => {
   82 |       const guiaData = createInvalidRecaudoGuiaData()[0];
   83 |       const response = await coordinadoraUser.attemptsTo<ApiResponse>(
   84 |         new CrearGuia(guiaData)
   85 |       );
   86 |
   87 |       expect(response.success).toBe(false);
   88 |       expect(response.error).toContain('HTTP 400');
   89 |       expect(response.errors).toBeDefined();
   90 |     });
   91 |
   92 |     test('should fail with 400 when valorRecaudar is at lower boundary (1)', async () => {
   93 |       const guiaData = { ...createValidRecaudoGuiaData(), valorRecaudar: '1' };
   94 |       const response = await coordinadoraUser.attemptsTo<ApiResponse>(
   95 |         new CrearGuia(guiaData)
   96 |       );
   97 |
   98 |       expect(response.success).toBe(false);
   99 |       expect(response.error).toContain('HTTP 400');
  100 |       expect(response.errors).toBeDefined();
  101 |       expect(response.errors?.[0].message).toContain('valor a recaudar');
  102 |     });
  103 |
  104 |     test('should fail with 400 when valorRecaudar is at upper boundary (16000000)', async () => {
  105 |       const guiaData = { ...createValidRecaudoGuiaData(), valorRecaudar: '16000000' };
  106 |       const response = await coordinadoraUser.attemptsTo<ApiResponse>(
  107 |         new CrearGuia(guiaData)
  108 |       );
  109 |
  110 |       expect(response.success).toBe(false);
  111 |       expect(response.error).toContain('HTTP 400');
  112 |       expect(response.errors).toBeDefined();
  113 |       expect(response.errors?.[0].message).toContain('valor a recaudar');
  114 |     });
  115 |   });
  116 |
  117 |   test.describe('Consultar Guía', () => {
  118 |     test('should retrieve existing guia information', async () => {
  119 |       // First create a guia
  120 |       const guiaData = createValidGuiaData();
  121 |       const createResponse = await coordinadoraUser.attemptsTo<ApiResponse>(
  122 |         new CrearGuia(guiaData)
  123 |       );
  124 |
  125 |       expect(createResponse.success).toBe(true);
  126 |       expect(createResponse.guia).toBeDefined();
  127 |
  128 |       // Then consult it
  129 |       const response = await coordinadoraUser.attemptsTo<ApiResponse>(
  130 |         new ConsultarGuia(createResponse.guia!)
  131 |       );
  132 |
  133 |       expect(response.success).toBe(true);
  134 |       expect(response.datosRemitente).toEqual(guiaData.datosRemitente);
  135 |       expect(response.datosDestinatario).toEqual(guiaData.datosDestinatario);
  136 |     });
  137 |
  138 |     test('should fail with 400 when consulting non-existent guia', async () => {
  139 |       const response = await coordinadoraUser.attemptsTo<ApiResponse>(
  140 |         new ConsultarGuia('NONEXISTENT')
  141 |       );
  142 |
  143 |       expect(response.success).toBe(false);
  144 |       expect(response.error).toContain('HTTP 400');
  145 |       expect(response.errors?.[0].code).toBe('BAD_MESSAGE');
  146 |       expect(response.errors?.[0].message).toContain('no encontrada');
  147 |     });
  148 |   });
  149 |
  150 |   test.describe('Validar Referencia', () => {
  151 |     test('should validate existing reference', async () => {
  152 |       // First create a guia with reference
  153 |       const guiaData = createValidGuiaData();
  154 |       const createResponse = await coordinadoraUser.attemptsTo<ApiResponse>(
  155 |         new CrearGuia(guiaData)
  156 |       );
  157 |
  158 |       expect(createResponse.success).toBe(true);
  159 |
  160 |       const response = await coordinadoraUser.attemptsTo<ApiResponse>(
  161 |         new ValidarReferencia(guiaData.referenciaGuia)
  162 |       );
  163 |
  164 |       expect(response.success).toBe(true);
  165 |       expect(response.valid).toBe(true);
```