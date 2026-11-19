import urllib.request
import re
import sqlite3
import json
import os

def main():
    url = 'https://raw.githubusercontent.com/iglesianazaret/biblia-reina-valera-1909-base-datos-sql/master/data.sql'
    print('Descargando RV1909 desde repositorio público...')
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as r:
        sql_text = r.read().decode('utf-8', errors='ignore')

    # Regex para capturar (book_id, chapter, verse, 'texto')
    pattern = re.compile(r"\((\d+),\s*(\d+),\s*(\d+),\s*'((?:\\.|[^'])*)'\)")
    matches = pattern.findall(sql_text)
    print(f'Total versículos encontrados: {len(matches)}')

    verses_list = []
    for b_id, ch, v_num, txt in matches:
        # Desescapar comillas
        clean_txt = txt.replace(r"\'", "'").replace(r'\"', '"').replace(r'\\', '\\')
        verses_list.append({
            'book_id': int(b_id),
            'chapter': int(ch),
            'verse': int(v_num),
            'text': clean_txt
        })

    os.makedirs('src/database/seeds', exist_ok=True)
    json_path = 'src/database/seeds/rv1909-complete.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(verses_list, f, ensure_ascii=False)
    print(f'Guardado {json_path} ({os.path.getsize(json_path)/(1024*1024):.2f} MB)')

    db_paths = [
        '/home/ismadev/.config/bible-church-media-system/database/bible.db',
        'userData/database/bible.db'
    ]

    for db_path in db_paths:
        parent_dir = os.path.dirname(db_path)
        if not os.path.exists(parent_dir):
            os.makedirs(parent_dir, exist_ok=True)

        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        
        # Verificar si la tabla bible_verses existe
        cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='bible_verses';")
        if not cur.fetchone():
            print(f'Saltando {db_path} (no inicializada aún).')
            conn.close()
            continue

        print(f'Insertando en {db_path}...')
        cur.execute('BEGIN TRANSACTION;')
        cur.executemany('''
            INSERT OR REPLACE INTO bible_verses (book_id, chapter, verse, text)
            VALUES (:book_id, :chapter, :verse, :text)
        ''', verses_list)
        conn.commit()
        cur.execute('SELECT COUNT(*) FROM bible_verses;')
        count = cur.fetchone()[0]
        print(f'  -> Total versículos en {db_path}: {count}')
        conn.close()

    print('¡Importación completada con éxito!')

if __name__ == '__main__':
    main()
