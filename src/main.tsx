import React from "react";
import ReactDOM from "react-dom/client";
import NotFound404 from "./components/NotFound404";
import "./index.css";
// import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Advanced from "./pages/Advanced";
import Authentification from "./pages/AuthentificationSection/Authentification";
import ProtectedRoute from "./pages/AuthentificationSection/ProtectedRoute";
import Contact from "./pages/Contact/Contact";
import Favories from "./pages/Favories/Favories";
import Settings from "./pages/Parametres/Settings";
import PublishAd from "./pages/PublishAd/PublishAd";
import SearchPopular from "./pages/SearchPopular";
import SearchType from "./pages/SearchType";
import Simple from "./pages/Simple";
import Subscription from "./pages/Subscription/Subscription";
import Ad from "./pages/ads/Ad";
import AdDescription from "./pages/ads/AdDescription";
import MyAds from "./pages/ads/MyAds";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound404 />,
  },
  {
    path: "/Auth",
    element: <Authentification />,
    errorElement: <NotFound404 />,
  },
  {
    path: "/DeposerAnnonce",
    element: (
      <ProtectedRoute>
        <PublishAd />
      </ProtectedRoute>
    ),
    errorElement: <NotFound404 />,
  },

  {
    path: "/Contactez-nous",
    element: <Contact />,
    errorElement: <NotFound404 />,
  },
  {
    path: "/Annonces",
    element: <Ad />,
    errorElement: <NotFound404 />,
  },
  {
    path: "/Villes/:ville/:budget",
    element: <Simple />,
    errorElement: <NotFound404 />,
  },
  {
    path: "/Villes/:ville",
    element: <SearchPopular />,
    errorElement: <NotFound404 />,
  },
  {
    path: "/Villes/:ville/:budget/:type/:surface/:meuble",
    element: <Advanced />,
    errorElement: <NotFound404 />,
  },
  {
    path: "/Annonces/:idann",
    element: <AdDescription />,
    errorElement: <NotFound404 />,
  },
  {
    path: "/Annonces/Type/:type",
    element: <SearchType />,
    errorElement: <NotFound404 />,
  },
  {
    path: "/Abonnements",
    element: <Subscription />,
    errorElement: <NotFound404 />,
  },

  {
    path: "/Favoris",
    element: (
      <ProtectedRoute>
        <Favories />
      </ProtectedRoute>
    ),
    errorElement: <NotFound404 />,
  },
  {
    path: "/Paramètres",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
    errorElement: <NotFound404 />,
  },
  {
    path: "/Mes-annonces",
    element: (
      <ProtectedRoute>
        <MyAds />
      </ProtectedRoute>
    ),
    errorElement: <NotFound404 />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
