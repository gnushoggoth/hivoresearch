# Stylized Game Environment Generation with PyTorch

This tutorial walks through implementing Neural Style Transfer for game environments using PyTorch, gradually building from basic concepts to a complete implementation that works with both images and video.

## Contents
1. [Setup and Installation](#setup-and-installation)
2. [Understanding Neural Style Transfer](#understanding-neural-style-transfer)
3. [Basic Image Style Transfer](#basic-image-style-transfer)
4. [Video Style Transfer](#video-style-transfer)
5. [Optimization Techniques](#optimization-techniques)
6. [Advanced Extensions](#advanced-extensions)

## Setup and Installation

First, let's set up our environment and install the necessary dependencies:

```python
# Install necessary packages
!pip install torch torchvision pillow numpy matplotlib opencv-python

# Import required libraries
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.autograd import Variable

import torchvision.transforms as transforms
import torchvision.models as models

from PIL import Image
import numpy as np
import matplotlib.pyplot as plt

import cv2
import os
import copy
```

## Understanding Neural Style Transfer

Neural Style Transfer (NST) involves taking two images—a content image (game environment) and a style image (artwork)—and generating a new image that combines the content of the first with the style of the second.

The technique works by:
1. Using a pre-trained CNN to extract feature representations
2. Defining a content loss to ensure the generated image maintains the content structure
3. Defining a style loss to ensure the generated image adopts the artistic style
4. Iteratively optimizing a random noise image to minimize both losses

## Basic Image Style Transfer

### Step 1: Load and Preprocess Images

```python
# Image loading function
def load_image(image_path, transform=None, max_size=None):
    image = Image.open(image_path)
    
    # Resize if specified
    if max_size:
        if max(image.size) > max_size:
            size = max_size
            image = image.resize((size, int(size * image.size[1] / image.size[0])), 
                                Image.LANCZOS)
    
    # Apply transforms
    if transform:
        image = transform(image).unsqueeze(0)
    
    return image

# Define image transformation
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                         std=[0.229, 0.224, 0.225])
])

# Load content and style images
content_path = 'game_screenshot.jpg'  # Your game environment image
style_path = 'artwork.jpg'  # Your style reference image

content_image = load_image(content_path, transform, max_size=512)
style_image = load_image(style_path, transform, max_size=512)

# Move images to device (GPU if available)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
content_image = content_image.to(device)
style_image = style_image.to(device)

# Display the images
def imshow(tensor, title=None):
    image = tensor.cpu().clone()
    image = image.squeeze(0)
    image = transforms.ToPILImage()(image)
    plt.imshow(image)
    if title:
        plt.title(title)
    plt.pause(0.001)

plt.figure(figsize=(10, 5))
plt.subplot(1, 2, 1)
imshow(content_image, 'Content Image')
plt.subplot(1, 2, 2)
imshow(style_image, 'Style Image')
plt.show()
```

### Step 2: Define Feature Extractor Using VGG19

```python
# Load pre-trained VGG19 model
vgg = models.vgg19(pretrained=True).features.to(device).eval()

# Feature extraction class
class VGGFeatures(nn.Module):
    def __init__(self):
        super(VGGFeatures, self).__init__()
        # Layer indices for content and style representations
        self.content_layers = ['conv_4_2']
        self.style_layers = ['conv_1_1', 'conv_2_1', 'conv_3_1', 'conv_4_1', 'conv_5_1']
        
        # Create a new model with selected layers
        self.model = copy.deepcopy(vgg)
        self.layer_map = {
            'conv_1_1': '0',
            'conv_2_1': '5',
            'conv_3_1': '10',
            'conv_4_1': '19',
            'conv_4_2': '21',
            'conv_5_1': '28'
        }
    
    def forward(self, x):
        features = {}
        
        # Extract features at specified layers
        for name, layer_idx in self.layer_map.items():
            layer = self.model[int(layer_idx)]
            x = layer(x)
            if name in self.content_layers or name in self.style_layers:
                features[name] = x
        
        return features

# Initialize feature extractor
feature_extractor = VGGFeatures().to(device).eval()
```

### Step 3: Define Loss Functions

```python
# Content loss function
class ContentLoss(nn.Module):
    def __init__(self, target):
        super(ContentLoss, self).__init__()
        self.target = target.detach()
        
    def forward(self, input):
        self.loss = F.mse_loss(input, self.target)
        return input

# Style loss function
class StyleLoss(nn.Module):
    def __init__(self, target_feature):
        super(StyleLoss, self).__init__()
        # Compute Gram matrix for target style
        self.target = self._gram_matrix(target_feature).detach()
        
    def forward(self, input):
        G = self._gram_matrix(input)
        self.loss = F.mse_loss(G, self.target)
        return input
    
    def _gram_matrix(self, input):
        batch_size, ch, h, w = input.size()
        features = input.view(batch_size * ch, h * w)
        G = torch.mm(features, features.t())
        # Normalize the Gram matrix
        return G.div(batch_size * ch * h * w)
```

### Step 4: Setup the Style Transfer Process

```python
# Create a function to perform style transfer
def style_transfer(content_img, style_img, num_steps=300, 
                  content_weight=1, style_weight=1000000):
    """
    Perform neural style transfer
    
    Parameters:
    content_img (torch.Tensor): Content image tensor
    style_img (torch.Tensor): Style image tensor
    num_steps (int): Number of optimization steps
    content_weight (float): Weight for content loss
    style_weight (float): Weight for style loss
    
    Returns:
    torch.Tensor: Stylized image
    """
    # Create a random noise image to optimize
    input_img = torch.randn(content_img.size(), device=device)
    
    # Extract features from content and style images
    content_features = feature_extractor(content_img)
    style_features = feature_extractor(style_img)
    
    # Create content loss modules
    content_losses = []
    for layer_name in feature_extractor.content_layers:
        target = content_features[layer_name]
        content_loss = ContentLoss(target)
        content_losses.append(content_loss)
    
    # Create style loss modules
    style_losses = []
    for layer_name in feature_extractor.style_layers:
        target_feature = style_features[layer_name]
        style_loss = StyleLoss(target_feature)
        style_losses.append(style_loss)
    
    # Set up optimizer
    optimizer = optim.LBFGS([input_img.requires_grad_()])
    
    # Training loop
    run = [0]
    while run[0] <= num_steps:
        
        def closure():
            # Clear gradients
            optimizer.zero_grad()
            
            # Forward pass
            features = feature_extractor(input_img)
            
            # Compute content loss
            content_score = 0
            for i, layer_name in enumerate(feature_extractor.content_layers):
                content_score += content_losses[i].loss
            
            # Compute style loss
            style_score = 0
            for i, layer_name in enumerate(feature_extractor.style_layers):
                style_score += style_losses[i].loss
            
            # Weighted total loss
            loss = content_weight * content_score + style_weight * style_score
            
            # Backpropagation
            loss.backward()
            
            run[0] += 1
            if run[0] % 50 == 0:
                print(f"Step {run[0]}/{num_steps}")
                print(f"Content Loss: {content_score.item():.4f}, Style Loss: {style_score.item():.4f}")
            
            return loss
        
        optimizer.step(closure)
    
    # Denormalize the output image
    output_img = input_img.clone()
    output_img = output_img.squeeze(0)
    output_img = output_img * torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1).to(device)
    output_img = output_img + torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1).to(device)
    output_img = output_img.clamp(0, 1)
    
    return output_img

# Run the style transfer
stylized_image = style_transfer(content_image, style_image)

# Display the result
plt.figure(figsize=(10, 10))
imshow(stylized_image.unsqueeze(0), 'Stylized Game Environment')
plt.show()

# Save the stylized image
def save_image(tensor, filename):
    image = tensor.cpu().clone()
    image = image.squeeze(0)
    image = transforms.ToPILImage()(image)
    image.save(filename)

save_image(stylized_image.unsqueeze(0), 'stylized_game_environment.jpg')
```

## Video Style Transfer

Now let's extend our implementation to handle video frames while maintaining temporal consistency.

```python
def process_video(video_path, style_img, output_path, 
                 frame_limit=None, temporal_weight=0.5):
    """
    Apply style transfer to a video
    
    Parameters:
    video_path (str): Path to input video
    style_img (torch.Tensor): Style image tensor
    output_path (str): Path to save output video
    frame_limit (int): Limit number of frames to process
    temporal_weight (float): Weight for temporal consistency
    
    Returns:
    None: Saves stylized video to output_path
    """
    # Open the video
    cap = cv2.VideoCapture(video_path)
    
    # Get video properties
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    # Create output video writer
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))
    
    # Initialize previous stylized frame for temporal consistency
    prev_stylized = None
    
    # Process each frame
    frame_count = 0
    
    while True:
        ret, frame = cap.read()
        if not ret or (frame_limit and frame_count >= frame_limit):
            break
        
        print(f"Processing frame {frame_count}")
        
        # Convert from BGR to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Convert to PIL Image and apply transformations
        frame_pil = Image.fromarray(frame_rgb)
        frame_tensor = transform(frame_pil).unsqueeze(0).to(device)
        
        # Apply style transfer
        if prev_stylized is None:
            # First frame - regular style transfer
            stylized_frame = style_transfer(frame_tensor, style_img)
            prev_stylized = stylized_frame
        else:
            # Subsequent frames - with temporal consistency
            # Modify style_transfer function to include previous frame influence
            stylized_frame = style_transfer(
                frame_tensor, 
                style_img,
                prev_stylized=prev_stylized,
                temporal_weight=temporal_weight
            )
            prev_stylized = stylized_frame
        
        # Convert back to numpy array for OpenCV
        stylized_np = stylized_frame.cpu().numpy().transpose(1, 2, 0)
        stylized_np = np.clip(stylized_np * 255, 0, 255).astype(np.uint8)
        
        # Convert back to BGR for OpenCV
        stylized_bgr = cv2.cvtColor(stylized_np, cv2.COLOR_RGB2BGR)
        
        # Write frame to output video
        out.write(stylized_bgr)
        
        frame_count += 1
    
    # Release resources
    cap.release()
    out.release()
    print(f"Video processing complete. Saved to {output_path}")
```

### Enhanced Style Transfer Function for Video

```python
# Enhanced style transfer function with temporal consistency
def style_transfer(content_img, style_img, num_steps=200, 
                  content_weight=1, style_weight=1000000,
                  prev_stylized=None, temporal_weight=0.5):
    """
    Perform neural style transfer with optional temporal consistency
    
    Parameters:
    content_img (torch.Tensor): Content image tensor
    style_img (torch.Tensor): Style image tensor
    num_steps (int): Number of optimization steps
    content_weight (float): Weight for content loss
    style_weight (float): Weight for style loss
    prev_stylized (torch.Tensor): Previous stylized frame for temporal consistency
    temporal_weight (float): Weight for temporal consistency
    
    Returns:
    torch.Tensor: Stylized image
    """
    # If previous frame exists, use it as initialization
    # Otherwise, use random noise initialization
    if prev_stylized is not None:
        input_img = prev_stylized.clone().detach().unsqueeze(0).to(device)
        # Add some noise to prevent overfitting to previous frame
        input_img = input_img + torch.randn_like(input_img) * 0.1
    else:
        input_img = torch.randn(content_img.size(), device=device)
    
    # Rest of the function similar to before
    # ...
    
    # Add temporal consistency loss if previous frame exists
    if prev_stylized is not None:
        temporal_loss = F.mse_loss(input_img, prev_stylized.unsqueeze(0))
        loss = content_weight * content_score + style_weight * style_score + temporal_weight * temporal_loss
    else:
        loss = content_weight * content_score + style_weight * style_score
        
    # ...

    return output_img
```

## Optimization Techniques

For real-time or near real-time style transfer, we can implement a feed-forward neural network:

```python
# Define a transformer network for fast style transfer
class TransformerNet(nn.Module):
    def __init__(self):
        super(TransformerNet, self).__init__()
        
        # Initial convolution
        self.conv1 = nn.Conv2d(3, 32, kernel_size=9, stride=1, padding=4)
        self.in1 = nn.InstanceNorm2d(32, affine=True)
        
        # Downsampling
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=2, padding=1)
        self.in2 = nn.InstanceNorm2d(64, affine=True)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, stride=2, padding=1)
        self.in3 = nn.InstanceNorm2d(128, affine=True)
        
        # Residual blocks
        self.res1 = ResidualBlock(128)
        self.res2 = ResidualBlock(128)
        self.res3 = ResidualBlock(128)
        self.res4 = ResidualBlock(128)
        self.res5 = ResidualBlock(128)
        
        # Upsampling
        self.deconv1 = nn.ConvTranspose2d(128, 64, kernel_size=3, stride=2, padding=1, output_padding=1)
        self.in4 = nn.InstanceNorm2d(64, affine=True)
        self.deconv2 = nn.ConvTranspose2d(64, 32, kernel_size=3, stride=2, padding=1, output_padding=1)
        self.in5 = nn.InstanceNorm2d(32, affine=True)
        
        # Output layer
        self.conv4 = nn.Conv2d(32, 3, kernel_size=9, stride=1, padding=4)
        
    def forward(self, x):
        # Encode
        y = F.relu(self.in1(self.conv1(x)))
        y = F.relu(self.in2(self.conv2(y)))
        y = F.relu(self.in3(self.conv3(y)))
        
        # Transform
        y = self.res1(y)
        y = self.res2(y)
        y = self.res3(y)
        y = self.res4(y)
        y = self.res5(y)
        
        # Decode
        y = F.relu(self.in4(self.deconv1(y)))
        y = F.relu(self.in5(self.deconv2(y)))
        y = self.conv4(y)
        
        # Scale output to [0, 1]
        return torch.tanh(y) * 0.5 + 0.5

# Residual block
class ResidualBlock(nn.Module):
    def __init__(self, channels):
        super(ResidualBlock, self).__init__()
        self.conv1 = nn.Conv2d(channels, channels, kernel_size=3, stride=1, padding=1)
        self.in1 = nn.InstanceNorm2d(channels, affine=True)
        self.conv2 = nn.Conv2d(channels, channels, kernel_size=3, stride=1, padding=1)
        self.in2 = nn.InstanceNorm2d(channels, affine=True)
        
    def forward(self, x):
        residual = x
        y = F.relu(self.in1(self.conv1(x)))
        y = self.in2(self.conv2(y))
        return residual + y
```

### Training the Fast Style Transfer Model

```python
def train_fast_style_transfer(content_dataset, style_img, epochs=2, batch_size=4):
    """
    Train a fast style transfer model
    
    Parameters:
    content_dataset: Dataset of content images
    style_img (torch.Tensor): Style image tensor
    epochs (int): Number of training epochs
    batch_size (int): Batch size for training
    
    Returns:
    TransformerNet: Trained model
    """
    # Create data loader
    data_loader = torch.utils.data.DataLoader(
        content_dataset, batch_size=batch_size, shuffle=True)
    
    # Initialize transformer network
    transformer = TransformerNet().to(device)
    
    # Loss functions
    mse_loss = nn.MSELoss()
    
    # Extract style features once
    style_features = feature_extractor(style_img)
    style_grams = {}
    for layer in feature_extractor.style_layers:
        features = style_features[layer]
        gram = StyleLoss(features)._gram_matrix(features)
        style_grams[layer] = gram
    
    # Setup optimizer
    optimizer = torch.optim.Adam(transformer.parameters(), lr=1e-3)
    
    # Training loop
    for epoch in range(epochs):
        print(f"Epoch {epoch+1}/{epochs}")
        
        for batch_idx, content_images in enumerate(data_loader):
            # Move to device
            content_images = content_images.to(device)
            
            # Forward pass through transformer
            stylized_batch = transformer(content_images)
            
            # Extract content and style features
            content_features = feature_extractor(content_images)
            stylized_features = feature_extractor(stylized_batch)
            
            # Content loss
            content_loss = 0
            for layer in feature_extractor.content_layers:
                content_loss += mse_loss(
                    stylized_features[layer], 
                    content_features[layer]
                )
            
            # Style loss
            style_loss = 0
            for layer in feature_extractor.style_layers:
                stylized_gram = StyleLoss(stylized_features[layer])._gram_matrix(
                    stylized_features[layer]
                )
                style_loss += mse_loss(stylized_gram, style_grams[layer])
            
            # Total variation loss for smoothing
            y = stylized_batch
            tv_loss = torch.sum(torch.abs(y[:, :, :, :-1] - y[:, :, :, 1:])) + \
                      torch.sum(torch.abs(y[:, :, :-1, :] - y[:, :, 1:, :]))
            
            # Combine losses
            loss = content_loss + style_loss * 1e5 + tv_loss * 1e-6
            
            # Backpropagation
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            
            if (batch_idx + 1) % 50 == 0:
                print(f"Batch {batch_idx+1}, Loss: {loss.item():.4f}")
        
    return transformer
```

### Using the Fast Style Transfer Model

```python
def stylize_video_fast(video_path, transformer, output_path):
    """
    Apply fast style transfer to a video
    
    Parameters:
    video_path (str): Path to input video
    transformer (TransformerNet): Trained transformer network
    output_path (str): Path to save output video
    
    Returns:
    None: Saves stylized video to output_path
    """
    # Open the video
    cap = cv2.VideoCapture(video_path)
    
    # Get video properties
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    # Create output video writer
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))
    
    # Process each frame
    frame_count = 0
    
    with torch.no_grad():
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            if frame_count % 100 == 0:
                print(f"Processing frame {frame_count}")
            
            # Convert from BGR to RGB
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Convert to PIL Image and apply transformations
            frame_pil = Image.fromarray(frame_rgb)
            frame_tensor = transform(frame_pil).unsqueeze(0).to(device)
            
            # Apply style transfer
            stylized_frame = transformer(frame_tensor)
            
            # Convert back to numpy array for OpenCV
            stylized_np = stylized_frame.cpu().squeeze(0).numpy().transpose(1, 2, 0)
            stylized_np = np.clip(stylized_np * 255, 0, 255).astype(np.uint8)
            
            # Convert back to BGR for OpenCV
            stylized_bgr = cv2.cvtColor(stylized_np, cv2.COLOR_RGB2BGR)
            
            # Write frame to output video
            out.write(stylized_bgr)
            
            frame_count += 1
    
    # Release resources
    cap.release()
    out.release()
    print(f"Video processing complete. Saved to {output_path}")
```

## Advanced Extensions

### Integration with Game Engines (Unity Example)

```python
# Example code for exporting stylized textures for Unity
def export_textures_for_unity(game_textures_dir, style_img, output_dir):
    """
    Apply style transfer to game textures for Unity
    
    Parameters:
    game_textures_dir (str): Directory containing game textures
    style_img (torch.Tensor): Style image tensor
    output_dir (str): Directory to save stylized textures
    
    Returns:
    None: Saves stylized textures to output_dir
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Get list of texture files
    texture_files = [f for f in os.listdir(game_textures_dir) 
                    if f.endswith(('.png', '.jpg', '.jpeg'))]
    
    # Train fast style transfer model
    # ... (code for training model)
    
    # Process each texture
    for texture_file in texture_files:
        print(f"Processing {texture_file}")
        
        # Load texture
        texture_path = os.path.join(game_textures_dir, texture_file)
        texture = load_image(texture_path, transform)
        
        # Apply style transfer
        stylized_texture = transformer(texture.to(device))
        
        # Save stylized texture
        output_path = os.path.join(output_dir, f"stylized_{texture_file}")
        save_image(stylized_texture, output_path)
    
    print(f"Texture processing complete. Saved to {output_dir}")
```

### Personalized Style Generation

```python
# Example for combining multiple style images
def blend_styles(style_img1, style_img2, blend_ratio=0.5):
    """
    Blend two style images
    
    Parameters:
    style_img1 (torch.Tensor): First style image tensor
    style_img2 (torch.Tensor): Second style image tensor
    blend_ratio (float): Blending ratio (0.0-1.0)
    
    Returns:
    dict: Blended style features
    """
    # Extract features from both style images
    style_features1 = feature_extractor(style_img1)
    style_features2 = feature_extractor(style_img2)
    
    # Blend Gram matrices
    blended_grams = {}
    for layer in feature_extractor.style_layers:
        features1 = style_features1[layer]
        features2 = style_features2[layer]
        
        gram1 = StyleLoss(features1)._gram_matrix(features1)
        gram2 = StyleLoss(features2)._gram_matrix(features2)
        
        # Linear interpolation of Gram matrices
        blended_grams[layer] = gram1 * blend_ratio + gram2 * (1 - blend_ratio)
    
    return blended_grams
```

### GAN-Based Style Transfer

```python
# Example of using a GAN for style transfer
class Generator(nn.Module):
    def __init__(self):
        super(Generator, self).__init__()
        # Similar to TransformerNet but with additional features
        # ...
        
class Discriminator(nn.Module):
    def __init__(self):
        super(Discriminator, self).__init__()
        # Discriminator architecture
        self.conv1 = nn.Conv2d(3, 64, 4, 2, 1)
        self.conv2 = nn.Conv2d(64, 128, 4, 2, 1)
        self.conv3 = nn.Conv2d(128, 256, 4, 2, 1)
        self.conv4 = nn.Conv2d(256, 512, 4, 2, 1)
        self.conv5 = nn.Conv2d(512, 1, 4, 1, 0)
        
        self.bn2 = nn.BatchNorm2d(128)
        self.bn3 = nn.BatchNorm2d(256)
        self.bn4 = nn.BatchNorm2d(512)
        
    def forward(self, x):
        x = F.leaky_relu(self.conv1(x), 0.2)
        x = F.leaky_relu(self.bn2(self.conv2(x)), 0.2)
        x = F.leaky_relu(self.bn3(self.conv3(x)), 0.2)
        x = F.leaky_relu(self.bn4(self.conv4(x)), 0.2)
        x = torch.sigmoid(self.conv5(x))
        return x

# Training loop for GAN-based style transfer would be more complex
# and involve adversarial loss alongside content and style losses
```

## Complete Project Implementation

Putting it all together, here's a complete workflow:

1. Capture game screenshots or video clips
2. Choose a style reference image
3. Train a fast style transfer model on a dataset of game environments
4. Apply the model to new game environments or videos
5. Optionally export styled textures for game engine integration

This implementation provides a solid foundation for exploring neural style transfer with PyTorch while allowing for creative extensions and optimizations based on your specific interests and goals.
