from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import shutil

root = Path(__file__).resolve().parent.parent
out = root / 'dist'
out.mkdir(exist_ok=True)
class Document(HTMLParser):
    def __init__(self):
        super().__init__(); self.links=[]; self.ids=set()
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f"Duplicate ID: {attrs['id']}"
            self.ids.add(attrs['id'])
        for key in ('href','src'):
            if key in attrs: self.links.append(attrs[key])
files=list(root.glob('*.html')) + list((root/'blog').rglob('*.html'))
docs={}
for path in files:
    doc=Document(); doc.feed(path.read_text(encoding='utf-8-sig')); docs[path.resolve()]=doc
for path,doc in docs.items():
    for link in doc.links:
        url=urlsplit(link)
        if url.scheme or url.netloc: continue
        target=(path.parent / unquote(url.path)).resolve() if url.path else path
        assert target.exists(), f'Missing local link: {path.name}: {link}'
        if url.fragment and target in docs:
            assert unquote(url.fragment) in docs[target].ids, f'Missing anchor: {link}'
for path in root.glob('*.html'): shutil.copy2(path,out/path.name)
for name in ('css','js','images','blog'): shutil.copytree(root/name,out/name,dirs_exist_ok=True)
for name in ('robots.txt','sitemap.xml'): shutil.copy2(root/name,out/name)
print(f'Validated {len(docs)} HTML documents and all local links; static output ready in dist.')
