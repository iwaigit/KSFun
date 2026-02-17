/**
 * Procesa una imagen: Redimensiona, Agrega Marca de Agua y Comprime.
 * @param file Archivo de imagen original
 * @param newName Nuevo nombre para el archivo (ej: KSF_01)
 * @returns Archivo procesado en formato WebP
 */
export async function processImage(file: File, newName: string): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const MAX_SIZE = 1280;
                let width = img.width;
                let height = img.height;

                // 1. Calcular Redimensionamiento (Manteniendo Aspect Ratio)
                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                // 2. Crear Canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject("No se pudo crear el contexto del canvas");

                // 3. Dibujar Imagen Redimensionada
                ctx.drawImage(img, 0, 0, width, height);

                // 4. Agregar Marca de Agua (Watermark)
                const fontSize = Math.floor(width * 0.05); // 5% del ancho
                ctx.font = `bold ${fontSize}px sans-serif`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // Blanco con 30% opacidad
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Posición: Centro o Esquina? Usuaro pidió "marca de agua de protección"
                // La pondremos en el centro y con rotación para mayor protección, o abajo a la derecha.
                // "karlaspice.fun"

                // Dibujamos en el centro
                ctx.save();
                ctx.translate(width / 2, height / 2);
                ctx.rotate(-Math.PI / 6); // Rotar -30 grados
                ctx.fillText('karlaspice.fun', 0, 0);
                ctx.restore();

                // 5. Exportar como WebP comprimido
                canvas.toBlob((blob) => {
                    if (!blob) return reject("Error al comprimir imagen");

                    const processedFile = new File([blob], `${newName}.webp`, {
                        type: 'image/webp',
                        lastModified: Date.now(),
                    });

                    resolve(processedFile);
                }, 'image/webp', 0.75); // Calidad 75%
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}
