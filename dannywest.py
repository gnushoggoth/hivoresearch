import cv2
import numpy as np
import svgwrite
from skimage.filters import threshold_otsu

# Load the enhanced glitch image
image_path = output_glitch_path
image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

# Apply edge detection for a more stylized vector look
edges = cv2.Canny(image, threshold1=50, threshold2=200)

# Convert edges to binary using thresholding
thresh_val = threshold_otsu(edges)
binary_image = edges > thresh_val

# Create an SVG drawing
svg_path = "/mnt/data/glitch-portrait-enhanced.svg"
dwg = svgwrite.Drawing(svg_path, profile='tiny')

# Define SVG paths from detected edges
h, w = binary_image.shape
for y in range(h):
    for x in range(w):
        if binary_image[y, x]:
            dwg.add(dwg.circle(center=(x, y), r=0.5, fill="black"))

# Save the SVG file
dwg.save()

# Return the new SVG file
svg_path
