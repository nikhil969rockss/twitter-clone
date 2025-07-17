import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// pages
import LoginPage from "./pages/auth/login/LoginPage";
import HomePage from "./pages/home/HomePage";
import SignupPage from "./pages/auth/signup/SignupPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

//components
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

const App = () => {
    return (
        <div className="flex max-w-6xl mx-auto">
            <Toaster />
            {/* common component, bc it is wrapped outside the <Routes> */}
            <Sidebar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/notifications" element={<NotificationPage />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
            </Routes>
            <RightPanel />
        </div>
    );
};
export default App;
