# EcoScan - Project Setup Guide

## **1. Extract the ZIP File**
1. Locate the downloaded ZIP file (`EcoScan-main.zip`).
2. Extract it to a directory of your choice (e.g., `C:\EcoScan-main` or `/home/user/EcoScan-main` on Linux/Mac).

---

## **2. Install Required Software**
Before running the project, you need to install the necessary software.

### **For Frontend (React/Vite)**
1. **Install Node.js & npm**
   - Download from: [https://nodejs.org/](https://nodejs.org/)
   - Install and verify installation with:
     ```sh
     node -v
     npm -v
     ```

### **For Backend (Python & Flask)**
2. **Install Python**
   - Download from: [https://www.python.org/downloads/](https://www.python.org/downloads/)
   - Verify installation:
     ```sh
     python --version
     pip --version
     ```
   - Ensure `pip` is installed with:
     ```sh
     python -m ensurepip
     ```

---

## **3. Install Dependencies**

### **Frontend (React)**
1. Open a terminal/command prompt and navigate to the `client` folder:
   ```sh
   cd EcoScan-main/client
   npm install
   ```
   - This installs all frontend dependencies from `package.json`.

### **Backend (Python & Flask)**
2. Open another terminal and navigate to the `server` folder:
   ```sh
   cd EcoScan-main/server
   pip install -r requirements.txt
   ```
   - This installs all necessary Python libraries.

---

## **4. Start the Project**

### **Start the Backend Server**
- In the `server` folder, run:
  ```sh
  python run.py
  ```
  - This starts the Flask backend.

### **Start the Frontend**
- In the `client` folder, run:
  ```sh
  npm run dev
  ```
  - This starts the React frontend, which will be accessible at `http://localhost:5173` (or the port specified).

---

## **5. Verify Everything is Working**
- Open a web browser and go to `http://localhost:5173`.
- If everything runs without errors, your project is now set up successfully! 🚀

---

## **Troubleshooting**
If you encounter any issues:
- Ensure all dependencies are installed correctly.
- Check if the ports are occupied by other applications.
- Restart the terminal and run the commands again.

For further support, contact your team members or refer to the project documentation.

