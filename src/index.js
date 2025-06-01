import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InfPage from "./components/addInfPage/index";
import Home from "./components/addHomePage/index";
import Header from "./components/addHeader/index";
import AuthPage from "./components/addAuthPage/index";
import { AuthProvider } from "./authprovider";
import Footer from "./components/addFooter/index";
import ProtectedRoute from "./protectedRoot";
import AccountPage from "./components/addAccountPage/index";
import NewsInfoPage from "./components/addNewsInfoPage";
import CreatePostPage from "./components/addCreatePostPage";
import WorkoutPage from "./components/addWorkoutPage";
import ClassPage from "./components/addClassPage";
import WorkoutProgressPage from "./components/AddWorkoutProgressPage";
import TrainersPage from "./components/addTrainersPage";
import InfoTrainerPage from "./components/addInfoTrainerPage";
import CommentsPage from "./components/addPostCommentsPage";
import RoomPage from "./components/addWorkoutRoomPage";
import WorkoutResult from "./components/addFinalWorkoutResultPage"
import UsersPage from "./components/addUsersPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/protected" element={<ProtectedRoute />} /> */}
          <Route path="/infpage" element={<InfPage />} />
          <Route path="/authpage" element={<AuthPage />} />
          <Route path="/newsandinf" element={<NewsInfoPage />} />
          <Route path="/workoutpage" element={<WorkoutPage />} />
          <Route path="/classpage/:workoutId" element={<ClassPage />} />
          <Route path="/userspage" element={<UsersPage />} />
          <Route path="/trainerspage" element={<TrainersPage />} />
          <Route path="/trainerspage/info" element={<InfoTrainerPage />} />
          <Route path="/newsandinf/comments" element={<CommentsPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/workoutprogress/:roomId" element={<WorkoutProgressPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/createpostpage" element={<CreatePostPage />} />
            <Route path="/workoutroom/:roomId" element={<RoomPage />} />
            <Route path="/workoutroom/:roomId/result" element={<WorkoutResult/>} />
          </Route>
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
