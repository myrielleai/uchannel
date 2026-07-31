export interface SheetProductItem {
  id: string | number;
  productName: string;
  dimensions: string;
  category: string;
  image?: string;
  price?: string;
  availability: boolean;
  description?: string;
}

const GSHEETS_API_URL =
  'https://script.google.com/macros/s/AKfycbwTTduT1yQOr_OuOzhlc70v0DoubeITZzxyQHDQBVIHDIRXh5bKA5dtatmSYC29C4bEgw/exec';

let catalogCache: SheetProductItem[] | null = null;

export async function fetchHardwareCatalog(forceRefresh = false): Promise<SheetProductItem[]> {
  if (catalogCache && !forceRefresh) {
    return catalogCache;
  }

  try {
    const response = await fetch(GSHEETS_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();

    if (!Array.isArray(rawData)) {
      console.warn('Google Sheets API returned non-array payload:', rawData);
      return [];
    }

    const parsedData: SheetProductItem[] = rawData.map((item: any, idx: number) => ({
      id: item.ID || `item-${idx + 1}`,
      productName: item['Product Name'] || item.productName || 'Unspecified LED Display',
      dimensions: item.Dimensions || item.dimensions || 'Custom Size',
      category: item.Category || item.category || 'General Display',
      image: item.Image || item.image || '',
      price: item.Price || item.price || '',
      availability: typeof item.Availability === 'boolean' ? item.Availability : true,
      description: item.Description || item.description || '',
    }));

    catalogCache = parsedData;
    return parsedData;
  } catch (error) {
    console.error('Failed to fetch GSheets solution equipment data:', error);
    return catalogCache || [];
  }
}
