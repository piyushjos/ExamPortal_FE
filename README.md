# Exam Portal Frontend

## Project Setup

### Initialize Vite Project
```sh
npm create vite@latest exam-portal-frontend --template react
cd exam-portal-frontend
npm install
```

### Install Material-UI
```sh
npm install @mui/material @emotion/react @emotion/styled
```

### Install HTTP Client (Axios)
```sh
npm install axios
```

## Project Structure
Consider organizing your project into the following folders:

```
exam-portal-frontend/
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Different views (login, dashboard, exam page, etc.)
│   ├── services/     # API service wrappers to interact with the backend
│   ├── utils/        # Helpers (e.g., authentication, token storage)
│   ├── App.js        # Main application component
│   ├── index.js      # Entry point
│   ├── ...
├── package.json      # Project dependencies & scripts
├── README.md         # Project documentation
```

This structure ensures better maintainability and modularity.

---

Happy coding! 🚀

