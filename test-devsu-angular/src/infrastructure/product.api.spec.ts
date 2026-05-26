import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import { httpClient, ProductApiRepository } from './product.api';

const product = {
  id: 'trj-crd',
  name: 'Tarjeta Credito',
  description: 'Descripcion valida de producto',
  logo: 'https://example.com/logo.png',
  date_release: '2023-02-01T00:00:00.000Z',
  date_revision: '2024-02-01T00:00:00.000Z',
};

function mockSuccess<T>(data: T, status = 200) {
  return vi.spyOn(httpClient, 'request').mockResolvedValue({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: { headers: new AxiosHeaders() },
  } as AxiosResponse<T>);
}

function mockAxiosError(status: number, data?: unknown) {
  const error = new AxiosError(
    'Request failed',
    AxiosError.ERR_BAD_REQUEST,
    { headers: new AxiosHeaders() } as AxiosResponse['config'],
    {},
    {
      status,
      data,
      statusText: 'Error',
      headers: {},
      config: { headers: new AxiosHeaders() },
    } as AxiosResponse
  );
  return vi.spyOn(httpClient, 'request').mockRejectedValue(error);
}

describe('repositorio API de productos', () => {
  afterEach(() => vi.restoreAllMocks());

  it('findAll mapea la lista y normaliza fechas', async () => {
    const requestMock = mockSuccess({ data: [product] });
    const list = await new ProductApiRepository().findAll();
    expect(list[0].date_release).toBe('2023-02-01');
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/products',
        method: 'GET',
      })
    );
  });

  it('findById normaliza las fechas', async () => {
    mockSuccess(product);
    const item = await new ProductApiRepository().findById('trj-crd');
    expect(item.date_revision).toBe('2024-02-01');
  });

  it('existsById llama al endpoint de verificacion', async () => {
    const requestMock = mockSuccess(true);
    const exists = await new ProductApiRepository().existsById('trj-crd');
    expect(exists).toBe(true);
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/products/verification/trj-crd',
        method: 'GET',
      })
    );
  });

  it('create envia el cuerpo del producto con POST', async () => {
    const requestMock = mockSuccess({ message: 'ok' });
    await new ProductApiRepository().create({
      ...product,
      date_release: '2023-02-01',
      date_revision: '2024-02-01',
    });
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/products',
        method: 'POST',
      })
    );
  });

  it('update envia el cuerpo del producto con PUT', async () => {
    const requestMock = mockSuccess({ message: 'ok' });
    await new ProductApiRepository().update('trj-crd', {
      ...product,
      date_release: '2023-02-01',
      date_revision: '2024-02-01',
    });
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/products/trj-crd',
        method: 'PUT',
      })
    );
  });

  it('delete llama al metodo DELETE', async () => {
    const requestMock = mockSuccess(undefined, 204);
    await new ProductApiRepository().delete('trj-crd');
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/products/trj-crd',
        method: 'DELETE',
      })
    );
  });

  it('lanza ApiError con el mensaje del servidor', async () => {
    mockAxiosError(400, { message: 'Identificador duplicado' });
    await expect(new ProductApiRepository().findAll()).rejects.toMatchObject({
      message: 'Identificador duplicado',
      name: 'ApiError',
    });
  });

  it('lanza ApiError con el codigo de estado si el cuerpo no trae mensaje', async () => {
    mockAxiosError(500);
    await expect(new ProductApiRepository().findAll()).rejects.toThrow('Error 500');
  });
});
