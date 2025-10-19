# Interactive 3D Portfolio

An immersive, modern portfolio website built with Three.js and modern web technologies, featuring interactive 3D elements and a clean, responsive design.

![3D Portfolio Banner](./public/images/3d-portfolio-preview.jpg)

## ✨ Features

- **Interactive 3D Elements**: Engaging user experience with Three.js-powered 3D models and animations
- **Modern UI/UX Design**: Clean, intuitive interface with smooth transitions and animations
- **Responsive Layout**: Seamless experience across desktop, tablet, and mobile devices
- **Tech Stack Showcase**: Visual representation of skills with custom SVG icons
- **Dynamic Contact Menu**: Interactive dropdown with social media links
- **Performance Optimized**: Fast loading times with optimized 3D models and efficient code
- **Dark/Light Mode**: Support for user theme preferences

## 🚀 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **3D Rendering**: Three.js
- **Models**: GLTF/GLB format with Draco compression
- **Build Tools**: Vite
- **Deployment**: GitHub Pages/Netlify

## 📦 Project Structure

```text
/
├── public/                # Static assets
│   ├── draco/             # Draco decoders for 3D model compression
│   ├── fonts/             # Custom font files
│   ├── images/            # Image assets
│   ├── models/            # 3D model files
│   └── textures/          # Texture files for 3D models
├── index.html             # Main HTML file
├── style.css              # Global styles
├── main.js                # Main JavaScript file with Three.js setup
└── package.json           # Project dependencies
```

## 🛠️ Setup & Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/yourusername/3d-portfolio.git
   cd 3d-portfolio
   ```

1. **Install dependencies**

   ```sh
   npm install
   ```

1. **Start the development server**

   ```sh
   npm run dev
   ```

1. **Build for production**

   ```sh
   npm run build
   ```

## 📱 Responsive Design

The portfolio is designed to work beautifully on:

- Desktop computers
- Tablets
- Mobile phones

Media queries ensure that the layout, typography, and 3D elements adapt to various screen sizes.

## 🎯 Performance Optimization

- 3D models are compressed using Draco compression
- Lazy loading for non-critical resources
- Optimized textures and assets
- Efficient JavaScript for smooth animations

## 🔮 Future Enhancements

- [ ] Add more interactive 3D elements
- [ ] Implement WebGL shaders for enhanced visuals
- [ ] Integrate a project showcase with filterable categories
- [ ] Add animation sequences triggered by user interaction
- [ ] Implement more advanced physics simulations

## 📝 License

MIT

## 🔗 Live Preview

[View Live Site](https://your-portfolio-url.com)
