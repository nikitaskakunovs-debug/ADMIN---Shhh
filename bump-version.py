#!/usr/bin/env python3
"""Cache-bust local script includes so every deploy fetches a coherent set.

Babel-in-browser loads ~20 interdependent .jsx files per page. On a CDN
(GitHub Pages) a browser can cache some files and re-fetch others, ending up
with a half-updated mix that breaks the whole app. Stamping every LOCAL
script src with the same ?v=<build> forces all files to refresh together.

Run before committing a deploy:  python3 bump-version.py
"""
import re, time, pathlib

FILES = ['mobile.html', 'desktop.html', 'admin/index.html']
ROOT = pathlib.Path(__file__).parent
version = str(int(time.time()))  # monotonic build stamp

# Local script srcs: *.jsx and supabase-live.js (NOT the https unpkg CDN ones).
pat = re.compile(r'(<script[^>]+src=")((?:\.\./)?[\w./-]+\.(?:jsx|js))(\?v=\d+)?(")')

for rel in FILES:
    p = ROOT / rel
    s = p.read_text()
    def repl(m):
        src = m.group(2)
        if src.startswith('http'):  # safety; pattern already excludes these
            return m.group(0)
        return f'{m.group(1)}{src}?v={version}{m.group(4)}'
    new = pat.sub(repl, s)
    p.write_text(new)
    print(f'stamped {rel} -> v={version}')
