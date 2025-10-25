import axios from 'axios';

// Mock data - Substituir com chamadas reais à API do Albion
const mockResources = [
  { id: 1, name: 'Oak Wood', price: 1.50, priceChange: 2.5, category: 'Resources', volume: 15420 },
  { id: 2, name: 'Pine Wood', price: 2.10, priceChange: -1.2, category: 'Resources', volume: 12850 },
  { id: 3, name: 'Copper Ore', price: 3.20, priceChange: 0.8, category: 'Ore', volume: 8920 },
  { id: 4, name: 'Iron Ore', price: 4.50, priceChange: 1.5, category: 'Ore', volume: 14320 },
  { id: 5, name: 'Linen Cloth', price: 2.75, priceChange: -0.5, category: 'Fabric', volume: 6450 },
  { id: 6, name: 'Silk Cloth', price: 5.80, priceChange: 3.2, category: 'Fabric', volume: 9870 },
  { id: 7, name: 'Leather', price: 6.20, priceChange: 1.1, category: 'Material', volume: 11200 },
  { id: 8, name: 'Stone Block', price: 1.20, priceChange: -2.3, category: 'Stone', volume: 25640 },
  { id: 9, name: 'Iron Bar', price: 8.50, priceChange: 2.4, category: 'Refined', volume: 7890 },
  { id: 10, name: 'Steel Bar', price: 12.30, priceChange: 0.9, category: 'Refined', volume: 5420 },
];

export async function fetchAlbionPrices() {
  try {
    // Em produção, usar:
    // const response = await axios.get('https://www.albion-online-stats.com/api/v2/stats/gold');
    // return response.data.map(item => ({...}));

    // Por enquanto, retornar dados mock
    return mockResources;
  } catch (error) {
    console.error('Erro ao buscar preços da API:', error);
    return mockResources;
  }
}