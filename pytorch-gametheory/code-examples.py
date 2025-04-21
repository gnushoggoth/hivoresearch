import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader

import torchvision.transforms as transforms
import torchvision.models as models
from torchvision.utils import save_image

from PIL import Image
import matplotlib.pyplot as plt
import numpy as np
import cv2
import os
import copy
import time

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Define image transformation pipeline
def get_transform(size=None):
    transform_list = []
    if size is not None:
        transform_list.append(transforms.Resize(size))
    transform_list.extend([
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    return transforms.Compose(transform_list)

# Load and preprocess images
def load_image(img_path, max_size=None):
    image = Image.open(img_path).convert('RGB')
    
    if max_size is not None:
        if max(image.size) > max_size:
            size = max_size
            image = image.resize((size, int(size * image.size[1] / image.size[0])), 
                                Image.LANCZOS)
    
    transform = get_transform()
    image = transform(image).unsqueeze(0)
    
    return image.to(device)

# Display image
def display_image(tensor, title=None):
    # Convert tensor to PIL image
    tensor = tensor.cpu().clone()
    tensor = tensor.squeeze(0)
    # Denormalize
    tensor = tensor * torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
    tensor = tensor + torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
    tensor = tensor.clamp(0, 1)
    
    img = transforms.ToPILImage()(tensor)
    plt.imshow(img)
    if title:
        plt.title(title)
    plt.pause(0.001)

# Save tensor as image
def save_tensor_as_image(tensor, filename):
    tensor = tensor.cpu().clone()
    tensor = tensor.squeeze(0)
    # Denormalize
    tensor = tensor * torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
    tensor = tensor + torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
    tensor = tensor.clamp(0, 1)
    
    img = transforms.ToPILImage()(tensor)
    img.save(filename)

# Custom dataset for training
class GameEnvironmentDataset(Dataset):
    def __init__(self, image_folder, transform=None):
        self.image_paths = [os.path.join(image_folder, img) 
                           for img in os.listdir(image_folder)
                           if img.endswith(('.png', '.jpg', '.jpeg'))]
        self.transform = transform if transform else get_transform()
        
    def __len__(self):
        return len(self.image_paths)
    
    def __getitem__(self, idx):
        image = Image.open(self.image_paths[idx]).convert('RGB')
        if self.transform:
            image = self.transform(image)
        return image

# VGG model for feature extraction
class VGGFeatures(nn.Module):
    def __init__(self):
        super(VGGFeatures, self).__init__()
        # Load pretrained VGG19 and set to evaluation mode
        vgg = models.vgg19(pretrained=True).features.to(device).eval()
        
        # Freeze all VGG parameters
        for param in vgg.parameters():
            param.requires_grad = False
        
        self.model = vgg
        
        # Layer mapping for content and style features
        self.content_layers = ['conv4_2']
        self.style_layers = ['conv1_1', 'conv2_1', 'conv3_1', 'conv4_1', 'conv5_1']
        
        # Create dictionary to map layer names to their indices
        self.layer_mapping = {
            'conv1_1': '0',
            'conv2_1': '5',
            'conv3_1': '10',
            'conv4_1': '19',
            'conv4_2': '21',
            'conv5_1': '28'
        }
    
    def forward(self, x):
        # Output features
        features = {}
        
        # Get intermediate layer outputs
        for name, layer_idx in self.layer_mapping.items():
            layer = int(layer_idx)
            x = self.model[:layer+1](x)
            if name in self.content_layers or name in self.style_layers:
                features[name] = x
                
        return features

# Compute Gram Matrix for style representation
def gram_matrix(input_tensor):
    batch_size, channels, height, width = input_tensor.size()
    features = input_tensor.view(batch_size * channels, height * width)
    gram = torch.mm(features, features.t())
    
    # Normalize
    return gram.div(batch_size * channels * height * width)

# Content Loss module
class ContentLoss(nn.Module):
    def __init__(self, target):
        super(ContentLoss, self).__init__()
        self.target = target.detach()  # Detach to avoid backprop through target
    
    def forward(self, input_tensor):
        self.loss = F.mse_loss(input_tensor, self.target)
        return input_tensor

# Style Loss module
class StyleLoss(nn.Module):
    def __init__(self, target_feature):
        super(StyleLoss, self).__init__()
        self.target = gram_matrix(target_feature).detach()
    
    def forward(self, input_tensor):
        gram = gram_matrix(input_tensor)
        self.loss = F.mse_loss(gram, self.target)
        return input_tensor

# Basic Style Transfer Function
def run_style_transfer(content_img, style_img, num_steps=300, 
                      content_weight=1, style_weight=1000000, 
                      show_progress=True):
    """
    Run style transfer algorithm
    
    Args:
        content_img: Content image tensor
        style_img: Style image tensor
        num_steps: Number of optimization steps
        content_weight: Weight for content loss
        style_weight: Weight for style loss
        show_progress: Whether to display progress
        
    Returns:
        Stylized image tensor
    """
    print("Starting style transfer process...")
    
    # Initialize feature extractor
    feature_extractor = VGGFeatures().to(device)
    
    # Create input image (using content image with added noise)
    input_img = content_img.clone()
    # Add noise to input image
    input_img = input_img + torch.randn_like(input_img) * 0.1
    input_img.requires_grad_(True)
    
    # Setup optimizer (LBFGS gives better results than Adam)
    optimizer = optim.LBFGS([input_img])
    
    # Extract features from content and style images
    content_features = feature_extractor(content_img)
    style_features = feature_extractor(style_img)
    
    # Create content and style loss modules
    content_losses = []
    style_losses = []
    
    # Setup content losses
    for layer_name in feature_extractor.content_layers:
        target = content_features[layer_name].detach()
        content_loss = ContentLoss(target)
        content_losses.append(content_loss)
    
    # Setup style losses
    for layer_name in feature_extractor.style_layers:
        target_feature = style_features[layer_name]
        style_loss = StyleLoss(target_feature)
        style_losses.append(style_loss)
    
    # Training loop
    start_time = time.time()
    
    # Track progress
    best_img = None
    best_loss = float('inf')
    
    for step in range(num_steps):
        def closure():
            nonlocal best_loss, best_img
            
            # Zero the gradient
            optimizer.zero_grad()
            
            # Forward pass through VGG
            features = feature_extractor(input_img)
            
            # Calculate content loss
            content_score = 0
            for i, layer_name in enumerate(feature_extractor.content_layers):
                layer_features = features[layer_name]
                content_loss = content_losses[i]
                content_loss(layer_features)
                content_score += content_loss.loss
            
            # Calculate style loss
            style_score = 0
            for i, layer_name in enumerate(feature_extractor.style_layers):
                layer_features = features[layer_name]
                style_loss = style_losses[i]
                style_loss(layer_features)
                style_score += style_loss.loss
            
            # Calculate total loss
            loss = content_weight * content_score + style_weight * style_score
            
            # Backpropagation
            loss.backward()
            
            # Track best result
            if loss.item() < best_loss:
                best_loss = loss.item()
                best_img = input_img.clone().detach()
            
            # Log progress
            if step % 50 == 0 and show_progress:
                print(f"Step {step}/{num_steps}:")
                print(f"  Content Loss: {content_score.item():.4f}")
                print(f"  Style Loss: {style_score.item():.4f}")
                print(f"  Total Loss: {loss.item():.4f}")
                
                # Display current result
                if show_progress:
                    plt.figure(figsize=(6, 6))
                    display_image(input_img.detach(), title=f"Step {step}")
                    plt.show()
            
            return loss
        
        # Update the image
        optimizer.step(closure)
    
    # Display final result
    if show_progress:
        plt.figure(figsize=(10, 10))
        display_image(best_img, title="Final Result")
        plt.show()
    
    time_elapsed = time.time() - start_time
    print(f"Style transfer completed in {time_elapsed:.2f}s")
    
    # Return best image found during optimization
    return best_img

# Fast Neural Style Transfer - Transformer Network
class TransformerNet(nn.Module):
    def __init__(self):
        super(TransformerNet, self).__init__()
        
        # Initial convolution layers
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
        # Initial convolution
        x = F.relu(self.in1(self.conv1(x)))
        
        # Downsampling
        x = F.relu(self.in2(self.conv2(x)))
        x = F.relu(self.in3(self.conv3(x)))
        
        # Residual blocks
        x = self.res1(x)
        x = self.res2(x)
        x = self.res3(x)
        x = self.res4(x)
        x = self.res5(x)
        
        # Upsampling
        x = F.relu(self.in4(self.deconv1(x)))
        x = F.relu(self.in5(self.deconv2(x)))
        
        # Output
        x = self.conv4(x)
        return torch.tanh(x) * 0.5 + 0.5  # Scale to [0, 1]

# Residual Block for the Transformer Network
class ResidualBlock(nn.Module):
    def __init__(self, channels):
        super(ResidualBlock, self).__init__()
        self.conv1 = nn.Conv2d(channels, channels, kernel_size=3, stride=1, padding=1)
        self.in1 = nn.InstanceNorm2d(channels, affine=True)
        self.conv2 = nn.Conv2d(channels, channels, kernel_size=3, stride=1, padding=1)
        self.in2 = nn.InstanceNorm2d(channels, affine=True)
        
    def forward(self, x):
        residual = x
        x = F.relu(self.in1(self.conv1(x)))
        x = self.in2(self.conv2(x))
        return x + residual  # Skip connection

# Train Fast Style Transfer Model
def train_fast_style_transfer(content_dataset, style_img, num_epochs=2, 
                             content_weight=1e5, style_weight=1e10, tv_weight=1e-6):
    """
    Train a fast style transfer model
    
    Args:
        content_dataset: Dataset of content images
        style_img: Style image tensor
        num_epochs: Number of training epochs
        content_weight: Weight for content loss
        style_weight: Weight for style loss
        tv_weight: Weight for total variation loss
        
    Returns:
        Trained TransformerNet model
    """
    print("Starting fast style transfer training...")
    
    # Initialize transformer network and feature extractor
    transformer = TransformerNet().to(device)
    feature_extractor = VGGFeatures().to(device)
    
    # Create data loader
    batch_size = 4
    data_loader = DataLoader(content_dataset, batch_size=batch_size, shuffle=True)
    
    # Extract features from style image once
    with torch.no_grad():
        style_features = feature_extractor(style_img)
        # Pre-compute gram matrices for style features
        style_grams = {layer: gram_matrix(style_features[layer]) 
                      for layer in feature_extractor.style_layers}
    
    # Setup optimizer
    optimizer = optim.Adam(transformer.parameters(), lr=1e-3)
    
    # Training loop
    for epoch in range(num_epochs):
        epoch_loss = 0
        print(f"Epoch {epoch+1}/{num_epochs}")
        
        for batch_idx, content_images in enumerate(data_loader):
            # Move to device
            content_images = content_images.to(device)
            
            # Generate stylized images
            stylized_images = transformer(content_images)
            
            # Extract features
            content_features = feature_extractor(content_images)
            stylized_features = feature_extractor(stylized_images)
            
            # Content loss - use the last convolutional layer
            content_loss = 0
            for layer in feature_extractor.content_layers:
                content_loss += F.mse_loss(
                    stylized_features[layer], 
                    content_features[layer]
                )
            
            # Style loss - use all style layers
            style_loss = 0
            for layer in feature_extractor.style_layers:
                # Calculate gram matrix for stylized image
                stylized_gram = gram_matrix(stylized_features[layer])
                # Compare with pre-computed style gram matrix
                style_loss += F.mse_loss(stylized_gram, style_grams[layer])
            
            # Total variation loss for smoothing
            # Calculate differences between adjacent pixels
            y = stylized_images
            tv_loss = torch.sum(torch.abs(y[:, :, :, :-1] - y[:, :, :, 1:])) + \
                     torch.sum(torch.abs(y[:, :, :-1, :] - y[:, :, 1:, :]))
            
            # Total loss
            loss = content_weight * content_loss + \
                   style_weight * style_loss + \
                   tv_weight * tv_loss
            
            # Backpropagation
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            
            # Track progress
            epoch_loss += loss.item()
            if batch_idx % 20 == 0:
                print(f"  Batch {batch_idx}/{len(data_loader)}, Loss: {loss.item():.4f}")
                
                # Display a sample image occasionally
                if batch_idx % 50 == 0:
                    with torch.no_grad():
                        sample = stylized_images[0].clone().detach()
                        plt.figure(figsize=(6, 6))
                        display_image(sample.unsqueeze(0), 
                                    title=f"Epoch {epoch+1}, Batch {batch_idx}")
                        plt.show()
        
        # End of epoch
        print(f"Epoch {epoch+1} completed, Avg Loss: {epoch_loss/len(data_loader):.4f}")
        
        # Save model checkpoint
        checkpoint_path = f"fast_style_model_epoch_{epoch+1}.pth"
        torch.save({
            'epoch': epoch,
            'model_state_dict': transformer.state_dict(),
            'optimizer_state_dict': optimizer.state_dict(),
        }, checkpoint_path)
        print(f"Model checkpoint saved to {checkpoint_path}")
    
    print("Training complete!")
    return transformer

# Apply Fast Style Transfer to Video
def stylize_video(video_path, model, output_path, 
                 max_frames=None, temp_smoothing=True,
                 smoothing_weight=0.5):
    """
    Apply style transfer to video using trained model
    
    Args:
        video_path: Path to input video file
        model: Trained transformer network
        output_path: Path to save output video
        max_frames: Maximum number of frames to process (None for all)
        temp_smoothing: Whether to apply temporal smoothing
        smoothing_weight: Weight for temporal smoothing
    """
    print(f"Processing video: {video_path}")
    
    # Open video
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Could not open video: {video_path}")
    
    # Get video properties
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if max_frames:
        process_frames = min(max_frames, total_frames)
    else:
        process_frames = total_frames
    
    print(f"Video properties: {width}x{height}, {fps} fps, {total_frames} frames")
    print(f"Processing {process_frames} frames")
    
    # Create video writer
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    # Prepare transform for frames
    transform = get_transform()
    
    # Process frames
    prev_stylized_frame = None
    
    with torch.no_grad():
        for frame_idx in range(process_frames):
            ret, frame = cap.read()
            if not ret:
                break
                
            # Convert frame from BGR to RGB
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Convert to PIL Image
            pil_frame = Image.fromarray(frame_rgb)
            
            # Apply the same transforms as during training
            content_tensor = transform(pil_frame).unsqueeze(0).to(device)
            
            # Apply style transfer
            stylized_tensor = model(content_tensor)
            
            # Apply temporal smoothing if not the first frame
            if temp_smoothing and prev_stylized_frame is not None:
                stylized_tensor = (1 - smoothing_weight) * stylized_tensor + \
                                smoothing_weight * prev_stylized_frame
            
            prev_stylized_frame = stylized_tensor.clone()
            
            # Convert back to numpy for OpenCV
            stylized_np = stylized_tensor.cpu().squeeze().permute(1, 2, 0).numpy()
            
            # Scale to 0-255 range and convert to uint8
            stylized_np = (stylized_np * 255).clip(0, 255).astype(np.uint8)
            
            # Convert back to BGR for OpenCV
            stylized_bgr = cv2.cvtColor(stylized_np, cv2.COLOR_RGB2BGR)
            
            # Write frame
            out.write(stylized_bgr)
            
            # Show progress
            if frame_idx % 100 == 0:
                print(f"Processed {frame_idx}/{process_frames} frames")
    
    # Release resources
    cap.release()
    out.release()
    print(f"Video processing complete. Output saved to: {output_path}")

# Complete example usage
def run_complete_example():
    """Complete example demonstrating the entire workflow"""
    
    # 1. Set paths
    content_path = "game_screenshot.jpg"
    style_path = "artwork.jpg"
    content_dir = "game_screenshots"
    output_dir = "stylized_output"
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # 2. Load images
    content_img = load_image(content_path, max_size=512)
    style_img = load_image(style_path, max_size=512)
    
    # 3. Display original images
    plt.figure(figsize=(12, 6))
    plt.subplot(1, 2, 1)
    display_image(content_img, title="Content Image")
    plt.subplot(1, 2, 2)
    display_image(style_img, title="Style Image")
    plt.show()
    
    # 4. Slow method (optimization-based style transfer)
    print("Performing optimization-based style transfer...")
    stylized_img = run_style_transfer(
        content_img, style_img,
        num_steps=300,
        content_weight=1,
        style_weight=1000000
    )
    
    # Save result
    output_path = os.path.join(output_dir, "stylized_slow.jpg")
    save_tensor_as_image(stylized_img.unsqueeze(0), output_path)
    print(f"Slow method result saved to: {output_path}")
    
    # 5. Fast method (training a transformer network)
    print("\nTraining fast style transfer model...")
    
    # Create dataset from game screenshots directory
    dataset = GameEnvironmentDataset(content_dir, transform=get_transform(256))
    
    # Train model
    fast_model = train_fast_style_transfer(
        dataset, style_img,
        num_epochs=2,
        content_weight=1e5,
        style_weight=1e10
    )
    
    # Save trained model
    model_path = os.path.join(output_dir, "fast_style_model.pth")
    torch.save(fast_model.state_dict(), model_path)
    print(f"Trained model saved to: {model_path}")
    
    # 6. Apply fast style transfer to single image
    with torch.no_grad():
        fast_stylized_img = fast_model(content_img)
    
    # Save fast result
    fast_output_path = os.path.join(output_dir, "stylized_fast.jpg")
    save_tensor_as_image(fast_stylized_img, fast_output_path)
    print(f"Fast method result saved to: {fast_output_path}")
    
    # 7. Apply to video
    video_path = "game_clip.mp4"
    if os.path.exists(video_path):
        print("\nApplying style transfer to video...")
        video_output_path = os.path.join(output_dir, "stylized_video.mp4")
        stylize_video(
            video_path, fast_model, video_output_path,
            max_frames=None,  # Process all frames
            temp_smoothing=True  # Apply temporal smoothing
        )
    
    print("\nComplete example finished!")

# If running as main script
if __name__ == "__main__":
    print("Starting Neural Style Transfer project")
    run_complete_example()