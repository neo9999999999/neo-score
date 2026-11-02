"""Gemini image generation for chocolatebox season key visuals.

usage: python3 gen.py models
       python3 gen.py gen <model> <season|all> [kind=banner|charm] [n=1]
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


STYLE = ('premium 3D render, Cinema 4D / Octane style, soft studio lighting with gentle rim light, glossy clearcoat '
         'and satin materials, subtle depth of field, rich but tasteful colors, very high detail, polished commercial '
         'key visual for a Korean mobile shopping app. No text, no letters, no numbers, no logos, no watermark.')
LAYOUT = ('Wide 2:1 banner. Props frame the LEFT and RIGHT edges and may be slightly cropped by the frame; the CENTER '
          'area (middle 55% of the width) stays clean and calm for a title that will be added later. Keep the '
          'composition of the reference image (same props, same positions) but upgrade it to photoreal premium quality.')
SEASON = {
    'christmas': 'Christmas. Deep emerald-green night background, soft warm spotlight in the center, gentle golden bokeh, light snow particles. Left: stylized glossy Christmas tree with gold star, red-and-white candy cane, red ornament. Right: red gift box with gold satin ribbon, small white gift box with green ribbon, metallic gold and blue ornaments.',
    'newyear': 'Korean Lunar New Year. Deep navy background with a golden radial glow and tiny gold sparkles. Left: red silk Korean lucky pouch (bokjumeoni) with gold cord and pleated top, antique gold Korean coins (round with square hole). Right: navy silk bokjumeoni with gold cord, more gold coins, small gold stars.',
    'valentine': "Valentine's Day for a chocolate gift brand. Deep plum / wine background with a soft pink spotlight. Left: large glossy red 3D heart, small pink heart, dark chocolate truffle. Right: glossy milk-chocolate heart, white and cocoa-dusted chocolate truffles, rose-gold sparkles.",
    'spring': 'Spring cherry blossom. Soft rose-pink gradient background, bright airy center. Cherry blossom branches entering from the top-left and top-right, clusters of 3D sakura flowers with translucent petals and yellow stamens, petals gently falling.',
    'family': "Korean Family Month (May, Parents' Day). Warm rose / coral background with a soft cream spotlight. Left: bouquet of red and pink carnations tied with a yellow satin ribbon, small gold heart. Right: cream envelope sealed with a red heart, small glossy red and pink hearts.",
    'summer': 'Summer. Bright ocean-blue gradient background with sunlight caustics. Left: glossy striped beach ball, pastel blue-pink popsicle. Right: pink-and-white striped swim ring, yellow popsicle, watermelon slice. Water droplets and small sparkles.',
    'autumn': 'Autumn. Warm burnt-orange to brown background with a golden afternoon glow. Left: large red maple leaf, yellow maple leaf, acorns. Right: glossy Korean persimmon with green calyx, orange maple leaf, small acorn. A few falling leaves.',
}
CHARM = {
    'christmas': 'a single glossy metallic red Christmas ornament ball with a gold cap',
    'newyear': 'a single red silk Korean lucky pouch (bokjumeoni) with gold cord',
    'valentine': 'a single glossy red 3D heart',
    'spring': 'a single pink cherry blossom flower with yellow stamens',
    'family': 'a single red carnation flower head with a short green calyx',
    'summer': 'a single glossy striped beach ball',
    'autumn': 'a single glossy red maple leaf',
}
BG = {'christmas': (14, 70, 45), 'newyear': (16, 28, 64), 'valentine': (70, 18, 45), 'spring': (214, 92, 140),
      'family': (190, 60, 90), 'summer': (10, 100, 170), 'autumn': (130, 55, 20)}


def ref_png(season):
    """3D layout render flattened on the season colour, as a composition reference."""
    from PIL import Image
    src = os.path.join(S, 'r3d', f'out-banner-{season}.png')
    im = Image.open(src).convert('RGBA'); bg = Image.new('RGBA', im.size, BG[season] + (255,)); bg.alpha_composite(im)
    p = os.path.join(OUT, f'ref-{season}.png'); bg.convert('RGB').resize((1280, 640)).save(p)
    return p


def generate(model, season, kind='banner', n=1):
    parts = []
    if kind == 'banner':
        prompt = f'{SEASON[season]} {LAYOUT} {STYLE}'
        with open(ref_png(season), 'rb') as f:
            parts.append({'inline_data': {'mime_type': 'image/png', 'data': base64.b64encode(f.read()).decode()}})
        aspect = '16:9'
    else:
        prompt = f'{CHARM[season]}, centered, isolated on a pure flat white background, soft contact shadow only, {STYLE}'
        aspect = '1:1'
    parts.append({'text': prompt})
    body = {'contents': [{'role': 'user', 'parts': parts}],
            'generationConfig': {'responseModalities': ['IMAGE', 'TEXT'], 'imageConfig': {'aspectRatio': aspect}}}
    saved = []
    for i in range(n):
        r = curl('POST', f'{API}/models/{model}:generateContent', body)
        cands = r.get('candidates') or []
        got = False
        for c in cands:
            for p in (c.get('content') or {}).get('parts', []):
                d = p.get('inlineData') or p.get('inline_data')
                if d and d.get('data'):
                    ext = 'png' if 'png' in d.get('mimeType', d.get('mime_type', 'png')) else 'jpg'
                    fp = os.path.join(OUT, f'{kind}-{season}-{i}.{ext}')
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
        model, which = sys.argv[2], sys.argv[3]
        kind = sys.argv[4] if len(sys.argv) > 4 else 'banner'
        n = int(sys.argv[5]) if len(sys.argv) > 5 else 1
        for s in (SEASON if which == 'all' else [which]):
            print(s, generate(model, s, kind, n))
