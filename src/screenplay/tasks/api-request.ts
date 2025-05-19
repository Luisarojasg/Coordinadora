import { Actor } from '../actor';
import { ApiAbility } from '../abilities/api-ability';

export class ApiRequest {
  constructor(
    private method: string,
    private endpoint: string,
    private data?: any
  ) {}

  async performAs(actor: Actor): Promise<any> {
    const apiAbility = actor.getAbility<ApiAbility>('ApiAbility');
    const context = apiAbility.getContext();

    try {
      console.log('Making request to:', this.endpoint);
      console.log('Request method:', this.method);
      console.log('Request data:', JSON.stringify(this.data, null, 2));
      
      const headers: Record<string, string> = {
        'Accept': 'application/json'
      };

      // Only set content-type for POST/PUT requests
      if (['POST', 'PUT'].includes(this.method)) {
        headers['Content-Type'] = 'application/json';
      }

      let response;
      switch (this.method) {
        case 'GET':
          response = await context.get(this.endpoint, { headers });
          break;
        case 'POST':
          response = await context.post(this.endpoint, { headers, data: this.data });
          break;
        case 'PUT':
          response = await context.put(this.endpoint, { headers, data: this.data });
          break;
        case 'DELETE':
          response = await context.delete(this.endpoint, { headers });
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${this.method}`);
      }

      console.log('Response status:', response.status());
      console.log('Response status text:', response.statusText());
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response data:', JSON.stringify(responseData, null, 2));
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        const text = await response.text();
        console.log('Raw response text:', text);
        return {
          success: false,
          error: `HTTP ${response.status()}: Invalid JSON response`,
          errors: [{
            code: 'BAD_MESSAGE',
            message: 'Invalid JSON response from server'
          }]
        };
      }

      if (responseData.isError) {
        return {
          success: false,
          error: `HTTP ${responseData.statusCode || response.status()}: ${responseData.message}`,
          errors: [{
            field: responseData.cause?.split(',')[0]?.trim(),
            message: responseData.cause,
            code: responseData.code
          }]
        };
      }

      return {
        success: true,
        guia: responseData.data?.codigo_remision,
        ...responseData
      };
    } catch (error: any) {
      console.error('Request error:', error);
      return {
        success: false,
        error: error?.message || 'Error en la petición',
        errors: [{
          code: 'BAD_MESSAGE',
          message: error?.message || 'Error en la petición'
        }]
      };
    }
  }
} 