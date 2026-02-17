import imageCompression from 'browser-image-compression';

/**
 * Comprime una imagen en el cliente antes de subirla.
 * @param file Archivo de imagen original
 * @returns Archivo de imagen comprimido
 */
export async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: 0.5,          // Intentar reducir a 0.5MB (500KB)
        maxWidthOrHeight: 1280,  // Redimensionar a 1280px máx
        useWebWorker: true,      // Usar hilo separado para no congelar la UI
        fileType: 'image/webp'   // Convertir a WebP para mejor compresión
    };

    try {
        const compressedFile = await imageCompression(file, options);
        // Retornamos un nuevo archivo con el nombre original pero extensión .webp si cambió
        return new File([compressedFile], file.name.replace(/\.[^/.]+$/, ".webp"), {
            type: 'image/webp',
        });
    } catch (error) {
        console.error("Error comprimiendo imagen:", error);
        return file; // Si falla, devolver original
    }
}
