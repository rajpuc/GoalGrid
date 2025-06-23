import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import useAuthenticationStore from "./store/useAuthenticationStore.js";
import useLoadingStore from "./store/useLoadingStore.js";
import Loader from "./components/loader/Loader.jsx";
import { Navigate, Route, Routes } from "react-router-dom";

// Lazy import
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegistrationPage = lazy(() => import("./pages/RegistrationPage.jsx"));
const HomePage = lazy(() => import("./pages/HomePage.jsx"));


function App() {
  const { isLoading } = useLoadingStore();
  const { checkAuth, loggedInUser } = useAuthenticationStore();

  useEffect(() => {
    (async () => await checkAuth())();
  }, []);

  return (
    <div className="font-cm-popin bg-cm-global">
      {isLoading && <Loader />}

      <Suspense fallback={<Loader />}>
        <Routes>
          {loggedInUser? (
            <>
              <Route path="/" element={<HomePage />} />
            </>
          ) : (
            <>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registration" element={<RegistrationPage />} />
            </>
          )}
        </Routes>
      </Suspense>

      <Toaster />
    </div>
  );
}

export default App;
