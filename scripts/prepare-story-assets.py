from pathlib import Path
from PIL import Image
import sys

target = Path(__file__).resolve().parents[1] / 'dist' / 'explora' / 'assets'
target.mkdir(parents=True, exist_ok=True)
for name, source in zip(('vessel', 'office', 'coast'), sys.argv[1:]):
    with Image.open(source) as image:
        for width in ((480, 960) if name == 'vessel' else (800, 1600)):
            result = image.convert('RGBA' if name == 'vessel' else 'RGB')
            result.thumbnail((width, width), Image.Resampling.LANCZOS)
            output = target / f'{name}-{width}.webp'
            result.save(output, 'WEBP', quality=84, method=4)
            print(output.name, output.stat().st_size)
