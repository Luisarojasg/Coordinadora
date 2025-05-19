# Test info

- Name: Coordinadora API Tests >> Validar Referencia >> should fail with 400 when validating non-existent reference
- Location: C:\Users\57320\Desktop\coordinadora\tests\guia.spec.ts:168:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
    at C:\Users\57320\Desktop\coordinadora\tests\guia.spec.ts:173:32
```

# Test source

```ts
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
  166 |     });
  167 |
  168 |     test('should fail with 400 when validating non-existent reference', async () => {
  169 |       const response = await coordinadoraUser.attemptsTo<ApiResponse>(
  170 |         new ValidarReferencia('NONEXISTENT')
  171 |       );
  172 |
> 173 |       expect(response.success).toBe(false);
      |                                ^ Error: expect(received).toBe(expected) // Object.is equality
  174 |       expect(response.error).toContain('HTTP 400');
  175 |       expect(response.errors?.[0].code).toBe('BAD_MESSAGE');
  176 |       expect(response.valid).toBe(false);
  177 |     });
  178 |   });
  179 | }); 
```