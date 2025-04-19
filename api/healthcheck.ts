// @ts-ignore - Игнорируем несоответствие версий типов
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Полифил для import.meta.dirname в Node.js 18
if (typeof import.meta.dirname === 'undefined') {
  // @ts-ignore - Расширяем import.meta
  import.meta.dirname = process.cwd();
}

// Эндпоинт для проверки работоспособности сервера
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Добавляем CORS заголовки
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    
    // Получаем информацию о среде выполнения
    const runtimeInfo = {
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'unknown',
      platform: process.platform,
      dirname: process.cwd(),
      importMetaDirname: typeof import.meta.dirname !== 'undefined' ? import.meta.dirname : 'not available',
      timestamp: new Date().toISOString(),
      status: 'ok'
    };
    
    return res.status(200).json(runtimeInfo);
  } catch (error) {
    console.error('Healthcheck failed:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}