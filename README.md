# 🔮 JSON::DIFF

> 🚀 A free online tool for comparing and analyzing differences between two JSON objects. Quickly identify added, modified, and removed properties in JSON data structures with a sleek cyberpunk-themed interface.

**🌐 [Live Demo](https://www.devtoolbox.space/)**

---

## ✨ Features

- ⚡ **Real-time JSON Comparison** - Instantly compare two JSON objects and visualize differences
- 🌳 **Deep Nested Support** - Handles deeply nested objects and arrays with JSON pointer notation
- 🎯 **Three Difference Categories**:
  - 🟢 **Added** - New properties in the "after" JSON
  - 🟡 **Modified** - Properties with changed values
  - 🔴 **Removed** - Properties deleted from the "before" JSON
- 🎪 **Product Data Scoping** - Optional scoping to `products[0]` structure with variant inclusion
- ✅ **Input Validation** - Real-time JSON syntax validation with error feedback
- 💻 **CLI Tool** - Batch comparison utility for command-line usage
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| 💚 [Vue 3](https://vuejs.org/) | Frontend framework (Composition API) |
| ⚡ [Vite](https://vitejs.dev/) | Build tool & development server |
| 🎨 [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| 🔧 [PostCSS](https://postcss.org/) | CSS transformations |

---

## 🚀 Getting Started

### 📋 Prerequisites

- 📦 Node.js (v16 or higher)
- 📥 npm or yarn

### 💾 Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/dev-tool-box.git

# Navigate to the project directory
cd dev-tool-box

# Install dependencies
npm install
```

### 🔥 Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` 🎉

### 📦 Production Build

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npm run preview
```

---

## 📖 Usage

### 🖥️ Web Interface

1. 📋 Paste your "before" JSON in the left panel
2. 📋 Paste your "after" JSON in the right panel
3. 🎯 (Optional) Toggle "Scope to products[0]" for product data structures
4. 🏷️ (Optional) Toggle "Include variants" to compare variant data
5. 🔍 Click **Compare** to see the differences

### 💻 CLI Tool

For batch comparisons, use the included command-line utility:

```bash
# Basic comparison
node compare_product_json.js before.json after.json

# Include variants in comparison
node compare_product_json.js before.json after.json --with-variants
```

---

## 📁 Project Structure

```
dev-tool-box/
├── 📂 src/
│   ├── 📄 main.js          # Vue app initialization
│   ├── 🎨 App.vue          # Main application component
│   └── 🎭 style.css        # Global styles & Tailwind directives
├── 📂 public/
│   ├── 🤖 robots.txt       # SEO robots directive
│   └── 🗺️ sitemap.xml      # XML sitemap
├── 🏠 index.html           # Entry point with SEO metadata
├── 📦 package.json         # Dependencies & scripts
├── ⚙️ vite.config.js       # Vite configuration
├── 🎨 tailwind.config.js   # Tailwind CSS configuration
├── 🔧 postcss.config.js    # PostCSS configuration
└── 🖥️ compare_product_json.js  # CLI comparison utility
```

---

## 💡 Use Cases

- 🧪 **API Testing** - Compare API responses before and after changes
- ⚙️ **Configuration Management** - Track changes in config files
- 🔍 **Data Validation** - Verify data integrity during migrations
- 🐛 **Debugging** - Identify unexpected changes in JSON payloads
- 👀 **Code Reviews** - Quickly spot differences in JSON fixtures

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. 📤 **Push** to the branch (`git push origin feature/amazing-feature`)
5. 🎉 **Open** a Pull Request

### 📝 Development Guidelines

- 🎯 Follow the existing code style
- ✍️ Write meaningful commit messages
- 🧪 Test your changes thoroughly before submitting

---

## 📜 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | 🔥 Start development server with hot-reload |
| `npm run build` | 📦 Create production build in `dist/` |
| `npm run preview` | 👁️ Preview production build locally |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE). 📜

---

## 🙏 Acknowledgments

- 💚 Built with Vue 3 and the amazing Vite ecosystem
- 🎨 Styled with Tailwind CSS
- ✨ Fonts: [Orbitron](https://fonts.google.com/specimen/Orbitron) & [Rajdhani](https://fonts.google.com/specimen/Rajdhani) from Google Fonts

---

<p align="center">
  Made with 💜 by developers, for developers
</p>

<p align="center">
  ⭐ Star this repo if you find it useful! ⭐
</p>
