// seed-movies.ts
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const tmdbKey = process.env.TMDB_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedMovies() {
  if (!tmdbKey) {
    console.error('❌ Error: TMDB_API_KEY belum ada di .env.local');
    return;
  }

  console.log('🍿 Mulai mengambil banyak film (Target: 3 Halaman / 60 Film)...');

  // KITA LOOPING 3 HALAMAN (Page 1, 2, 3)
  for (let page = 1; page <= 3; page++) {
    console.log(`\n📄 Sedang memproses Halaman ${page}...`);
    
    try {
      // Fetch per halaman
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbKey}&language=en-US&page=${page}`
      );
      
      if (!response.ok) {
        console.error(`❌ Gagal mengambil halaman ${page}`);
        continue; // Lanjut ke halaman berikutnya kalau error
      }

      const data = await response.json();
      const movies = data.results;

      // Masukkan film dari halaman ini ke database
      for (const movie of movies) {
        const movieData = {
          title: movie.title,
          description: movie.overview,
          poster_url: movie.poster_path 
            ? `https://image.tmdb.org/t/p/original${movie.poster_path}` 
            : null,
          tmdb_id: movie.id,
          // Link Nonton Otomatis (VidSrc)
          video_url: `https://vidsrcme.ru/embed/movie?tmdb=${movie.id}`,
        };

        // Cek duplikat
        const { data: existing } = await supabase
          .from('movies')
          .select('id')
          .eq('tmdb_id', movie.id)
          .single();

        if (!existing) {
          const { error } = await supabase.from('movies').insert(movieData);
          if (error) console.error(`   ❌ Gagal: ${movie.title}`, error.message);
          else console.log(`   ✅ (+Film): ${movie.title}`);
        } else {
          // Update jika sudah ada
          await supabase.from('movies').update(movieData).eq('id', existing.id);
          console.log(`   🔄 (Update): ${movie.title}`);
        }
      }

    } catch (err) {
      console.error(`❌ Error sistem di halaman ${page}:`, err);
    }
  }

  console.log('\n🎉 Selesai! Cek Database Supabase Anda, sekarang isinya sudah banyak!');
}

seedMovies();