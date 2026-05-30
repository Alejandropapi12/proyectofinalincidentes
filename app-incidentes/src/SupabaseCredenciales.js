import { createClient } from '@supabase/supabase-js';

// ⚠️ CORRECCIÓN: Quitamos '/rest/v1/' para que el Storage funcione correctamente
const supabaseUrl = 'https://xdarkxrceognppgnrgtl.supabase.co';
const supabaseKey = 'sb_publishable_26fMRY29pymyaCswFbtGIA_Lq2tyJ-R';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Estandarizamos el nombre a camelCase limpio: uploadImage
export const uploadImage = async (file, bucket, folder) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Subir archivo al bucket especificado
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Obtener la URL pública (String)
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return urlData.publicUrl;

  } catch (error) {
    console.error('Error interno en Supabase:', error);
    throw error;
  }
};