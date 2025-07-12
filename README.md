# Patient Wellness Portal

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge&logo=vercel)](https://patientwellness.vercel.app/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

The Patient Wellness Portal is a full-stack web application designed to help users track their wellness journey and for administrators to manage user data effectively. The choices outlined below were made to prioritize developer experience, scalability, performance, and security, reflecting modern development practices.

---

## ✨ Features

-   **User Authentication:** Secure user registration and login functionality.
-   **User Dashboard:** A personalized dashboard for users to view and track their wellness data.
-   **Admin Panel:** A comprehensive admin dashboard to view, edit, and delete user records.
-   **Dynamic Data Management:** Admins can manage complex user data, including medications, weight history, and shipment details.
-   **Responsive Design:** A mobile-first design that ensures a seamless experience across all devices.

---

## 🎨 Design & Prototyping

The application's UI/UX was designed in Figma and Behance to ensure a user-centric and visually appealing interface.

-   [**Figma Design File**](https://www.figma.com/design/QKG6uN393XQqfChIuumvql/Suryansh-Singh-s-team-library?node-id=3364-2&t=LdcMpxcfv3AAuvy2-1)
-   [**Behance Project Showcase**](https://www.behance.net/gallery/230198657/Patient-Wellness-Portal)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

Make sure you have the following installed on your machine:
-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
-   [Git](https://git-scm.com/)

### Installation & Setup

1.  **Clone the Repository**
    ```sh
    git clone [https://github.com/Anshu4062/Submission---Full-Stack-Engineer-Take-Home-Challenge-Patient-Dashboard.git](https://github.com/Anshu4062/Submission---Full-Stack-Engineer-Take-Home-Challenge-Patient-Dashboard.git)
    ```

2.  **Navigate to the Project Directory**
    ```sh
    cd Submission---Full-Stack-Engineer-Take-Home-Challenge-Patient-Dashboard
    ```

3.  **Install Dependencies**
    This command will download all the necessary packages for the project.
    ```sh
    npm install
    ```

4.  **Set Up Environment Variables**
    Create a `.env.local` file in the root of your project and add your MongoDB connection string:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    ```

5.  **Run the Development Server**
    This will start the project on a local server, usually at `http://localhost:3000`.
    ```sh
    npm run dev
    ```

You should now be able to access the application in your browser at `http://localhost:3000`.

---

## 🛠️ Tech Stack

-   **Frontend:** React, Next.js, Tailwind CSS
-   **Backend:** Next.js API Routes
-   **Database:** MongoDB with Mongoose
-   **Authentication:** JWT (JSON Web Tokens)
-   **Deployment:** Vercel

---

## 🌐 Deployment

This project is deployed on Vercel. You can view the live application here:

**[https://patientwellness.vercel.app/](https://patientwellness.vercel.app/)**

