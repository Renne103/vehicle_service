import { useAppSelector } from "../store/store";

export const useAuth = () => {
	const token = useAppSelector((state) => state.auth.token);
	return {
	  isAuthenticated: !!token,
	};
  };