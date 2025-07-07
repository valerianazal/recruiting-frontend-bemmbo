import { chunkArray } from '@/helpers';

export async function injectInvoices(invoiceIds: string[], token: string) {
  const batches = chunkArray(invoiceIds, 25);

  for (const batch of batches) {
    const response = await fetch('https://recruiting.data.bemmbo.com/invoices/inject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
      body: JSON.stringify({ invoiceIds: batch }),
    });


    if (!response.ok) {
      throw new Error('Error al inyectar un batch de facturas');
    }
  }

  return true;
}