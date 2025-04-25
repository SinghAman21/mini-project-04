import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Budget from "./components/Budget";
import ChatInterface from "./components/ChatInterface";
import EpidemicManagement from "./components/EpidemicManagement";
import RootLayout from "./layouts/RootLayout";
import ErrorPage from "./components/ErrorPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <App />,
			},
			{
				path: "chat",
				element: <ChatInterface />,
			},
			{
				path: "budget",
				element: <Budget />,
			},
			{
				path: "epidemic",
				element: <EpidemicManagement />,
			},
		],
	},
]);

export default function Router() {
	return <RouterProvider router={router} />;
}
