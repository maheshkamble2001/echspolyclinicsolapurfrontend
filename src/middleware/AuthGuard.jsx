import { useLocation, useOutlet } from "react-router";


export default function AuthGuard() {
  // const location = useLocation();
  const outlet = useOutlet();
  // if (location.pathname = "/") {
  //   return <Navigate to={`/clinic`} />
  // }
  return outlet;
}