# testBy — Simple Quiz App

**testBy** is a lightweight, customizable web quiz app designed to help you prep for exams. It supports single and multiple correct answers, question shuffling, and tracks your score with instant feedback.

---
### 🔗 Live Demo

Check out the working app here: [Live Demo](https://szabomozes.github.io/testBy/)


---

## Features

- Load quiz questions from a JSON file (`data.json`)
- Shuffle questions optionally
- Supports single and multiple correct answers
- Immediate answer validation with visual feedback
- Score summary with correct/incorrect counts
- Easy restart without page reload

---

## How to Use

1. Clone this repo or download the files.  
2. Add your questions and answers in `data.json` using the same format as the default.  
3. Serve the files using a local server (e.g., [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code).  
4. Open the served `index.html` in your browser.  
5. Click **START**, answer the questions, and see your score instantly.


---

## `data.json` Format Example

```json
[
  {
    "id": "0",
    "question": "Sample question?",
    "options": ["Answer 1", "Answer 2", "Answer 3"],
    "correct": ["Answer 1"]
  },
  {
    "id": "1",
    "question": "Multi-answer question?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": ["Option A", "Option C"]
  }
]
