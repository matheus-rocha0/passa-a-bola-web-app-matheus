import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mkphbnrfeqlwczmlhnru.supabase.co'; // Cole a URL do seu projeto aqui
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rcGhibnJmZXFsd2N6bWxobnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NzE5NjAsImV4cCI6MjA3NDI0Nzk2MH0.cozOQnURyJsMGFOhHI9ofqBC52lQnPJQkF-i7pg1Om8'; // Cole sua chave de API aqui

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
