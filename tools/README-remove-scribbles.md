Quick guide: remove yellow scribbles + text

1) Requirements
- Python 3.8+
- OpenCV for Python

Install:

```bash
pip install opencv-python numpy
```

2) Usage

Interactive (pick region with mouse):

```bash
python tools/remove_scribbles.py --input path/to/input.jpg --output path/to/output.jpg
```

Provide rectangle explicitly (x,y,w,h):

```bash
python tools/remove_scribbles.py --input input.jpg --output output.jpg --rect 120,900,1800,320
```

Non-interactive only remove yellow strokes:

```bash
python tools/remove_scribbles.py --input input.jpg --output output.jpg --no-interactive
```

3) Notes
- The script detects yellow marker by an HSV color range; if the scribble color differs, tweak the HSV bounds in `detect_yellow_mask`.
- If inpainting leaves small artifacts, re-run with slightly different rect or adjust morphological kernel sizes.
- If you want, upload the image file to the workspace and tell me the filename; I can run the script here and return the edited image.
