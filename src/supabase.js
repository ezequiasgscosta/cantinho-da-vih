import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://umlwlnvstysnefwsfias.supabase.co";
const supabaseKey = "sb_publishable_tED0fBLVzdAI2cI7Q_LI6g_jMaSG6BH";

export const supabase = createClient(supabaseUrl, supabaseKey);