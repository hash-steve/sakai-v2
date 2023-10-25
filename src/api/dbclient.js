import {createClient} from '@supabase/supabase-js';
const url = process.env.REACT_APP_DB_URL;
const apiKey = process.env.REACT_APP_DB_API_KEY;
export const supabase = createClient(url, apiKey);