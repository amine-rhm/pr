import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  userInfo: {
    nom: string;
    prenom: string;
    num: string;
    email: string;
  } | null;
  Role: string | null;
  token: string | null;
  userId: string | null;
}

interface AuthActions {
  login: (token: string | undefined) => void;
  setRole: (status: string) => void;
  setId: (Id: string) => void;
  logout: () => void;
  setUserInfo: (
    nom: string,
    prenom: string,
    email: string,
    num: string
  ) => void;
}

const useAuthStore = create<AuthState & AuthActions>((set) => {
  // Load initial state from localStorage
  const storedToken = localStorage.getItem("token");
  const storedUserInfo = localStorage.getItem("userInfo");
  const role = localStorage.getItem("Role");
  const userId = localStorage.getItem("Id");

  const initialState: AuthState = {
    isAuthenticated: !!storedToken,
    userInfo: storedUserInfo ? JSON.parse(storedUserInfo) : null,
    token: storedToken,
    Role: role,
    userId: userId,
  };

  return {
    ...initialState,

    login: (token) => {
      localStorage.setItem("token", JSON.stringify(token));
      set({ isAuthenticated: true, token });
    },

    logout: () => {
      localStorage.clear();
      set({ isAuthenticated: false, userInfo: null, token: null, Role: null });
    },
    setRole: (status) => {
      set({ Role: status });
    },
    setId: (Id) => {
      set({ userId: Id });
    },
    setUserInfo: (nom, prenom, email, num) => {
      const userInfo = { nom, prenom, email, num }; // Include email in the userInfo object
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      set({ userInfo });
    },

  };
});

export const useUserInfo = () => {
  const userInfo = useAuthStore((state) => state.userInfo);

  if (!userInfo) {
    return { nom: "", prenom: "", email: "", num: "" }; // Default values when userInfo is null
  }

  return {
    nom: userInfo.nom,
    prenom: userInfo.prenom,

    email: userInfo.email,
    num: userInfo.num,
  };
};

export default useAuthStore;
