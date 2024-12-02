import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../Zustand/Store';



type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/Auth', { replace: true });
    }
  }, [navigate, isAuthenticated]);

  return children;
}