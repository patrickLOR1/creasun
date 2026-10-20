from pathlib import Path
from PIL import Image

assets = Path(__file__).resolve().parents[1] / 'dist' / 'assets'
for source in assets.glob('*.jpg'):
    with Image.open(source) as image:
        for width in (480, 960):
            result = image.convert('RGB')
            result.thumbnail((width, width), Image.Resampling.LANCZOS)
            result.save(assets / f'{source.stem}-{width}.webp', 'WEBP', quality=80, method=6)
            print(source.stem, width, (assets / f'{source.stem}-{width}.webp').stat().st_size)
