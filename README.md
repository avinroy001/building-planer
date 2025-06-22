Building Planner - React App

A simple, intuitive web-based building planning tool built with React and HTML5 Canvas. It allows users to draw, move, and annotate shapes like lines, rectangles, and circles — perfect for sketching basic floor plans or diagrams.

---

Final Project Checklist:

 Drawing tools: Line, Rectangle, Circle
 Select + Move + Resize tools
 Annotations: Length, Breadth, Radius
 Shape deletion (keyboard + button)
 Resize handles (blue squares)
 Clean canvas rendering
 Component structure: Toolbar, DrawingBoard, ToolContext
 Good UX with hover, cursor, and outline handling

Getting Started

Clone the repository
git clone https://github.com/avinroy001/building-planer.git
cd building-planner
Install dependencies
npm install
Run the development server
npm start
App runs at: http://localhost:3000

Project Structure

src/
│
├── components/
│   ├── Toolbar.jsx          
│   └── DrawingBoard.jsx     
│
├── context/
│   └── ToolContext.js       
├── App.js                   
└── index.js                 

Future Enhancements (Suggestions)

Save/load drawings from backend (MongoDB or Firebase)
Export drawing as image or JSON
Undo/redo functionality
Zoom & pan tools
Unit selection (e.g., ft, m)

npm test

Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change or enhance.

Author
Made with ❤️ by Avinash Roy

