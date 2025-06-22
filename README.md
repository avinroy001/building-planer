# 🏗️ Building Planner - React App

A simple, intuitive web-based building planning tool built with **React** and **HTML5 Canvas**. It allows users to draw, move, and annotate shapes like lines, rectangles, and circles — perfect for sketching basic floor plans or diagrams.

---

## ✨ Features

- 🖌️ **Drawing Tools**: Line, Rectangle, Circle.
- 🖱️ **Select Tool**: Move or modify existing shapes.
- 🧾 **Annotations**: Toggle length, breadth, and radius info on shapes.
- 🎯 **Responsive Canvas**: Interactive and scalable drawing area.
- 💡 Clean architecture using **Context API** and **functional components**.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** and **npm** installed:

```bash
node -v
npm -v
Installation
Clone the repository
git clone https://github.com/avinroy001/building-planer.git
cd building-planner
Install dependencies
npm install
Run the development server
npm start
App runs at: http://localhost:3000

🧠 Project Structure

src/
│
├── components/
│   ├── Toolbar.jsx          # Drawing tool buttons
│   └── DrawingBoard.jsx     # Canvas rendering and shape logic
│
├── context/
│   └── ToolContext.js       # Global tool state with Context API
│
├── App.js                   # Root app component
└── index.js                 # App entry point


📦 Future Enhancements (Suggestions)

Save/load drawings from backend (MongoDB or Firebase)
Export drawing as image or JSON
Undo/redo functionality
Zoom & pan tools
Unit selection (e.g., ft, m)

npm test

🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change or enhance.

👨‍💻 Author

Made with ❤️ by Avinash Roy

