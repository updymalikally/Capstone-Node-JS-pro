import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import https from 'https';

// Fix SSL certificate verification on Node.js 24 / Windows
// (Node 24 defaults to stricter TLS and may not trust system CA on Windows)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});


/**
 * Upload buffer stream to Cloudinary
 * @param {Buffer} buffer 
 * @param {string} folder 
 * @returns {Promise<Object>}
 */
export const uploadBufferToCloudinary = (buffer, folder = 'profile_pictures') => {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Detect missing or placeholder Cloudinary credentials
    const isPlaceholder =
      !cloudName ||
      !apiKey ||
      !apiSecret ||
      cloudName === 'demo' ||
      cloudName === 'demo_cloud' ||
      apiKey === '123456789012345' ||
      apiSecret === 'sample_secret_key' ||
      apiKey.length < 15;

    if (isPlaceholder) {
      // Use a real base64 data URL so it actually displays in the app
      const mime = 'image/jpeg';
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${mime};base64,${base64}`;
      console.log('[Cloudinary] Using local base64 fallback (no valid credentials)');
      return resolve({
        secure_url: dataUrl,
        public_id: `local_${Date.now()}`,
        format: 'jpg',
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
};

export default cloudinary;
