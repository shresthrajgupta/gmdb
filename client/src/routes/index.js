import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import Explore from "../pages/Explore";
import Search from "../pages/Search";
import Game from "../pages/Game";
import Franchise from "../pages/Franchise";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Navigate to="login" replace />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "signup",
                element: <Signup />
            },
            {
                path: "home",
                element: <Home />
            },
            {
                path: "search",
                element: <Search />
            },
            {
                path: "playlist",
                element: <Explore />
            },
            {
                path: "completedlist",
                element: <Explore />
            },
            {
                path: "game/guid/:id",
                element: <Game />
            },
            {
                path: "franchise/guid/:id",
                element: <Franchise />
            },
            {
                path: "*",
                element: <NotFound />
            },
        ]
    }
])

export default router;