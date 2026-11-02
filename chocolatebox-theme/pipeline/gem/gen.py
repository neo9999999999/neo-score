"""Gemini image generation for chocolatebox season key visuals.

usage: python3 gen.py models
       python3 gen.py gen <model> <season|all> <slot[,slot]|all> [n=1] [screenshot.png ...]
       slots: see prompts_data.SLOTS (screen needs screenshots)
Reads GEMINI_API_KEY from env (never printed). Uses curl so the proxy CA is honored.
Each banner request sends the current 3D layout render as a composition reference.
"""
import base64, json, os, subprocess, sys, tempfile

API = 'https://generativelanguage.googleapis.com/v1beta'
HERE = os.path.dirname(os.path.abspath(__file__))
S = os.path.dirname(HERE)
OUT = os.path.join(HERE, 'out'); os.makedirs(OUT, exist_ok=True)


def curl(method, url, body=None):
    key = os.environ.get('GEMINI_API_KEY', '')
    if not key:
        sys.exit('GEMINI_API_KEY not set')
    hdr = tempfile.NamedTemporaryFile('w', delete=False, dir=HERE, suffix='.hdr')
    hdr.write(f'x-goog-api-key: {key}\nContent-Type: application/json\n'); hdr.close()
    cmd = ['curl', '-sS', '--max-time', '300', '-X', method, '-H', f'@{hdr.name}', url]
    bf = None
    if body is not None:
        bf = tempfile.NamedTemporaryFile('w', delete=False, dir=HERE, suffix='.json'); json.dump(body, bf); bf.close()
        cmd += ['--data-binary', f'@{bf.name}']
    try:
        r = subprocess.run(cmd, capture_output=True, text=True)
    finally:
        os.unlink(hdr.name)
        if bf: os.unlink(bf.name)
    try:
        return json.loads(r.stdout)
    except Exception:
        return {'raw': r.stdout[:500], 'err': r.stderr[:500]}


from prompts_data import SEASONS as SEASON, SLOTS, ASPECT, prompt as build_prompt

BG = {'christmas': (14, 70, 45), 'newyear': (16, 28, 64), 'valentine': (70, 18, 45), 'spring': (214, 92, 140),
      'family': (190, 60, 90), 'summer': (10, 100, 170), 'autumn': (130, 55, 20)}


def ref_png(season):
    """3D layout render flattened on the season colour, as a composition reference."""
    from PIL import Image
    src = os.path.join(S, 'r3d', f'out-banner-{season}.png')
    im = Image.open(src).convert('RGBA'); bg = Image.new('RGBA', im.size, BG[season] + (255,)); bg.alpha_composite(im)
    p = os.path.join(OUT, f'ref-{season}.png'); bg.convert('RGB').resize((1280, 640)).save(p)
    return p


def generate(model, season, kind='banner', n=1, screen=None):
    """kind: any key of prompts_data.SLOTS. 'banner' also sends the 3D layout render as a composition reference;
    'screen' needs a screenshot path (screen=...), e.g. design/phones/default-boxes.png."""
    parts = []
    if kind == 'banner':
        with open(ref_png(season), 'rb') as f:
            parts.append({'inline_data': {'mime_type': 'image/png', 'data': base64.b64encode(f.read()).decode()}})
        text = build_prompt(season, kind) + ' Keep the composition of the reference image (same props, same positions) but upgrade it to photoreal premium quality.'
    elif kind == 'screen':
        with open(screen, 'rb') as f:
            parts.append({'inline_data': {'mime_type': 'image/png', 'data': base64.b64encode(f.read()).decode()}})
        text = build_prompt(season, kind)
    else:
        text = build_prompt(season, kind)
    parts.append({'text': text})
    body = {'contents': [{'role': 'user', 'parts': parts}],
            'generationConfig': {'responseModalities': ['IMAGE', 'TEXT'], 'imageConfig': {'aspectRatio': ASPECT[kind]}}}
    tag = kind if kind != 'screen' else 'screen-' + os.path.basename(screen).rsplit('.', 1)[0]
    saved = []
    for i in range(n):
        r = curl('POST', f'{API}/models/{model}:generateContent', body)
        got = False
        for c in r.get('candidates') or []:
            for p in (c.get('content') or {}).get('parts', []):
                d = p.get('inlineData') or p.get('inline_data')
                if d and d.get('data'):
                    ext = 'png' if 'png' in d.get('mimeType', d.get('mime_type', 'png')) else 'jpg'
                    fp = os.path.join(OUT, f'{tag}-{season}-{i}.{ext}')
                    with open(fp, 'wb') as f: f.write(base64.b64decode(d['data']))
                    saved.append(fp); got = True
        if not got:
            print('no image:', season, kind, json.dumps(r)[:600])
    return saved


if __name__ == '__main__':
    if sys.argv[1] == 'models':
        r = curl('GET', f'{API}/models?pageSize=200')
        for m in r.get('models', []):
            if 'image' in m['name'] or 'imagen' in m['name']:
                print(m['name'], m.get('supportedGenerationMethods'))
        if 'models' not in r: print(json.dumps(r)[:500])
    else:
        # gen <model> <season|all> <slot|all> [n] [screenshot.png ...]
        model, which = sys.argv[2], sys.argv[3]
        kinds = sys.argv[4] if len(sys.argv) > 4 else 'banner'
        n = int(sys.argv[5]) if len(sys.argv) > 5 else 1
        shots = sys.argv[6:]
        for s in (SEASON if which == 'all' else [which]):
            for k in (list(SLOTS) if kinds == 'all' else kinds.split(',')):
                if k == 'screen':
                    for sh in shots: print(s, k, generate(model, s, k, n, sh))
                else:
                    print(s, k, generate(model, s, k, n))
