#!/usr/bin/env python3
"""
Remove yellow marker scribbles and text in a selected region using OpenCV inpainting.
Usage:
  python tools/remove_scribbles.py --input input.jpg --output output.jpg
  python tools/remove_scribbles.py --input input.jpg --output output.jpg --rect 120,900,1800,320

If --rect is omitted, an interactive ROI selection window will open (requires a GUI).
"""
import argparse
import cv2
import numpy as np
import sys


def detect_yellow_mask(img_bgr):
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    # Tuned yellow range (may be adjusted)
    lower = np.array([15, 100, 100])
    upper = np.array([40, 255, 255])
    mask = cv2.inRange(hsv, lower, upper)
    # Clean up
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7,7))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    mask = cv2.dilate(mask, kernel, iterations=1)
    return mask


def detect_text_mask_in_rect(img_bgr, rect):
    x, y, w, h = rect
    roi = img_bgr[y:y+h, x:x+w]
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    # Adaptive threshold to pick up darker text on light background
    th = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                               cv2.THRESH_BINARY_INV, 25, 10)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
    th = cv2.morphologyEx(th, cv2.MORPH_OPEN, kernel, iterations=1)
    # Expand text mask a bit
    th = cv2.dilate(th, kernel, iterations=2)
    mask = np.zeros(img_bgr.shape[:2], dtype=np.uint8)
    mask[y:y+h, x:x+w] = th
    return mask


def parse_rect(s):
    try:
        parts = [int(p) for p in s.split(',')]
        if len(parts) != 4:
            raise ValueError()
        return tuple(parts)
    except Exception:
        raise argparse.ArgumentTypeError('Rect must be x,y,w,h')


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--input', '-i', required=True)
    p.add_argument('--output', '-o', required=True)
    p.add_argument('--rect', type=parse_rect, help='Optional rectangle x,y,w,h to target the text area')
    p.add_argument('--no-interactive', action='store_true', help='Do not open interactive ROI selector')
    args = p.parse_args()

    img = cv2.imread(args.input)
    if img is None:
        print('Failed to load image:', args.input)
        sys.exit(1)

    # detect yellow strokes
    yellow_mask = detect_yellow_mask(img)

    combined_mask = yellow_mask.copy()

    if args.rect:
        text_mask = detect_text_mask_in_rect(img, args.rect)
        combined_mask = cv2.bitwise_or(combined_mask, text_mask)
    else:
        if not args.no_interactive:
            # Let user select ROI interactively
            win = 'Select ROI (press ENTER when done, ESC to cancel)'
            cv2.namedWindow(win, cv2.WINDOW_NORMAL)
            r = cv2.selectROI(win, img, showCrosshair=True, fromCenter=False)
            cv2.destroyWindow(win)
            if r[2] > 0 and r[3] > 0:
                text_mask = detect_text_mask_in_rect(img, r)
                combined_mask = cv2.bitwise_or(combined_mask, text_mask)
        else:
            print('No rect provided and interactive disabled. Only yellow scribbles will be removed.')

    # Final cleanup of combined mask
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5,5))
    combined_mask = cv2.morphologyEx(combined_mask, cv2.MORPH_CLOSE, kernel, iterations=2)

    # Inpaint
    inpainted = cv2.inpaint(img, combined_mask, 3, cv2.INPAINT_TELEA)

    ok = cv2.imwrite(args.output, inpainted)
    if not ok:
        print('Failed to write output:', args.output)
        sys.exit(1)
    print('Wrote', args.output)


if __name__ == '__main__':
    main()
