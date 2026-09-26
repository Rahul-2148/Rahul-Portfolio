import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

export function configureCloudinary(config?: {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
}) {
  const cloud_name = config?.cloudName || process.env.CLOUDINARY_CLOUD_NAME || '';
  const api_key = config?.apiKey || process.env.CLOUDINARY_API_KEY || '';
  const api_secret = config?.apiSecret || process.env.CLOUDINARY_API_SECRET || '';

  if (cloud_name && api_key && api_secret) {
    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
      secure: true,
    });
  }
}

export async function ensureCloudinaryConfigured(): Promise<boolean> {
  if (isCloudinaryConfigured()) return true;

  try {
    const { connectToDatabase } = await import('@/lib/db/mongodb');
    const { PortfolioModel } = await import('@/lib/db/models/Portfolio');
    await connectToDatabase();
    const doc = await PortfolioModel.findOne({ docId: 'main' }).select('cloudinary').lean();
    if (doc?.cloudinary?.cloudName && doc?.cloudinary?.apiKey && doc?.cloudinary?.apiSecret) {
      configureCloudinary(doc.cloudinary);
      return isCloudinaryConfigured();
    }
  } catch (err) {
    console.warn('Could not read Cloudinary config from DB fallback:', err);
  }
  return false;
}

export function isCloudinaryConfigured(): boolean {
  const cfg = cloudinary.config();
  return Boolean(cfg.cloud_name && cfg.api_key && cfg.api_secret);
}

export async function verifyCloudinaryConnection(): Promise<{
  connected: boolean;
  cloudName: string;
  message: string;
}> {
  await ensureCloudinaryConfigured();

  if (!isCloudinaryConfigured()) {
    return {
      connected: false,
      cloudName: '',
      message: 'Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) not set. Using local disk fallback.',
    };
  }

  try {
    const pingRes = await cloudinary.api.ping();
    const cfg = cloudinary.config();
    return {
      connected: pingRes.status === 'ok',
      cloudName: cfg.cloud_name || '',
      message: pingRes.status === 'ok' ? `Cloudinary CDN connected (${cfg.cloud_name})` : 'Cloudinary ping failed',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Connection test failed';
    return {
      connected: false,
      cloudName: cloudinary.config().cloud_name || '',
      message: `Cloudinary error: ${msg}`,
    };
  }
}

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  bytes: number;
  format: string;
  originalFilename: string;
  provider: 'cloudinary' | 'local_fallback';
}

/**
 * Upload a file buffer to Cloudinary, or fallback to local /public/uploads/ directory.
 */
export async function uploadMedia(
  buffer: Buffer,
  options: {
    folder?: string;
    resourceType?: 'auto' | 'image' | 'raw';
    filename?: string;
    format?: string;
  } = {}
): Promise<CloudinaryUploadResult> {
  const {
    folder = 'portfolio',
    resourceType = 'auto',
    filename = `file_${Date.now()}`,
  } = options;

  await ensureCloudinaryConfigured();

  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          use_filename: true,
          unique_filename: true,
          filename_override: filename,
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            console.error('Cloudinary stream upload error:', error);
            reject(error || new Error('Upload failed'));
            return;
          }

          resolve({
            url: result.url,
            secureUrl: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
            format: result.format || 'pdf',
            originalFilename: result.original_filename || filename,
            provider: 'cloudinary',
          });
        }
      );

      uploadStream.end(buffer);
    });
  }

  // Local fallback if Cloudinary credentials are not present in .env.local yet
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const safeName = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const filePath = path.join(uploadsDir, safeName);
  fs.writeFileSync(filePath, buffer);

  const publicUrl = `/uploads/${folder}/${safeName}`;
  const ext = path.extname(filename).replace('.', '') || 'bin';

  return {
    url: publicUrl,
    secureUrl: publicUrl,
    publicId: `local_${folder}_${safeName}`,
    bytes: buffer.length,
    format: ext,
    originalFilename: filename,
    provider: 'local_fallback',
  };
}

/**
 * Delete a media asset from Cloudinary by its publicId.
 * Automatically tries alternative resource_type ('image' <-> 'raw') to guarantee deletion.
 */
export async function deleteMedia(
  publicId: string,
  resourceType: 'image' | 'raw' = 'image'
): Promise<{ success: boolean; message: string }> {
  if (!publicId) {
    return { success: false, message: 'Missing publicId' };
  }

  if (publicId.startsWith('local_')) {
    try {
      // Local fallback removal
      const parts = publicId.replace('local_', '').split('_');
      const folder = parts[0] || 'portfolio';
      const filename = parts.slice(1).join('_');
      const targetPath = path.join(process.cwd(), 'public', 'uploads', folder, filename);
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
      }
      return { success: true, message: 'Local file deleted successfully.' };
    } catch (err) {
      console.error('Error removing local file:', err);
      return { success: true, message: 'Local reference removed.' };
    }
  }

  await ensureCloudinaryConfigured();

  if (!isCloudinaryConfigured()) {
    return {
      success: true,
      message: 'Cloudinary not configured. Database reference cleared.',
    };
  }

  try {
    let res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    // If not found in primary resource_type, try the alternative
    if (res.result !== 'ok') {
      const altType: 'image' | 'raw' = resourceType === 'image' ? 'raw' : 'image';
      const altRes = await cloudinary.uploader.destroy(publicId, {
        resource_type: altType,
      });
      if (altRes.result === 'ok') {
        res = altRes;
      }
    }

    return {
      success: res.result === 'ok' || res.result === 'not found',
      message: `Cloudinary response: ${res.result}`,
    };
  } catch (err) {
    console.error('Cloudinary deletion error:', err);
    return { success: false, message: 'Failed to delete asset from Cloudinary CDN.' };
  }
}
