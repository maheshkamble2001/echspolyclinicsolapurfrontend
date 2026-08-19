// Import Dependencies
import { useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { toast } from "sonner";

// Local Imports
import { fixedEncrypt, normalDecryptData, normalEncryptData } from "configs/encryption";
import { isTokenValid, setSession } from "utils/jwt";
import { AuthContext } from "./context";
// import { getLogIn } from "api/login/login";

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  errorMessage: null,
  user: null,
  role: [],
  roleid: null,
  rolename: null,
  supplierAccess: 0,
  advanceAccess: 0,
};

// ----------------------------------------------------------------------

const reducerHandlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user, role, roleid, rolename, supplierAccess, advanceAccess } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      role,
      roleid,
      rolename,
      supplierAccess,
      advanceAccess,
    };
  },

  LOGIN_REQUEST: (state) => ({
    ...state,
    isLoading: true,
  }),

  LOGIN_SUCCESS: (state, action) => {
    const { user, role, roleid, rolename, supplierAccess, advanceAccess } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true,
      user,
      role,
      roleid,
      rolename,
      supplierAccess,
      advanceAccess,
    };
  },

  LOGIN_ERROR: (state, action) => {
    const { errorMessage } = action.payload;
    return {
      ...state,
      errorMessage,
      isLoading: false,
    };
  },

  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    role: [],
    roleid: null,
    rolename: null,
    supplierAccess: 0,
    advanceAccess: 0,
  }),
};

// ----------------------------------------------------------------------

const reducer = (state, action) => {
  const handler = reducerHandlers[action.type];
  if (handler) return handler(state, action);
  return state;
};

// ----------------------------------------------------------------------
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ✅ Initialize Authentication on Refresh
  useEffect(() => {
    const init = async () => {
      try {
        const token = Cookies.get("access_token");

        if (token && isTokenValid(token)) {
          setSession(token);

          const name = Cookies.get("name");
          const email = Cookies.get("email");
          const id = Cookies.get("userid");
          const role = Cookies.get("role")
            ? JSON.parse(normalDecryptData(Cookies.get("role")))
            : [];
          // const role = Cookies.get("role");
          const roleid = Cookies.get("roleid")
            ? parseInt(Cookies.get("roleid"))
            : null;
          const rolename = Cookies.get("rolename") || null;
          const supplierAccess = Cookies.get("supplierAccess")
            ? parseInt(Cookies.get("supplierAccess"))
            : 0;
          const advanceAccess = Cookies.get("advanceAccess")
            ? parseInt(Cookies.get("advanceAccess"))
            : 0;

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user: { name, email, id },
              role,
              roleid,
              rolename,
              supplierAccess,
              advanceAccess,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
              role: [],
              roleid: null,
              rolename: null,
              supplierAccess: 0,
              advanceAccess: 0,
            },
          });
        }
      } catch (err) {
        console.error("Auth init error:", err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
            role: [],
            roleid: null,
            rolename: null,
            supplierAccess: 0,
            advanceAccess: 0,
          },
        });
      }
    };

    init();
  }, []);

  // ✅ Login Function
  // ✅ Login Function (Updated)
  const login = async (args) => {
    dispatch({ type: "LOGIN_REQUEST" });

    try {
      // let responseData;

      // // CHECK: Kya data pehle se call ho chuka hai (Google Login case)
      // // Agar args ke andar access_token hai, matlab API call ho chuki hai
      // if (args?.access_token) {
      //   responseData = { code: 200, data: args, message: "Login Success" };
      // } else {
      //   // Normal Username/Password login case
      //   responseData = await getLogIn(args);
      // }
      // if (responseData.code === 200) {
      //   const {
      //     access_token,
      //     name,
      //     email,
      //     userid,
      //     roleAccess,
      //     roleId,
      //     roleName,
      //     supplierAccess,
      //     advanceAccess,
      //     approver
      //   } = responseData.data;

      //   if (!access_token) throw new Error("Token missing in response");

      //   // ✅ Store Cookies
      //   Cookies.set("access_token", access_token, { expires: 15 });
      //   Cookies.set("name", name, { expires: 15 });
      //   Cookies.set("email", email || "", { expires: 15 });
      //   Cookies.set("userid", userid, { expires: 15 });
      //   Cookies.set(
      //     "role",
      //     normalEncryptData(JSON.stringify(roleAccess || [100000]))
      //   );
      //   Cookies.set("roleid", roleId?.toString() || "", { expires: 15 });
      //   Cookies.set("rolename", roleName || "", { expires: 15 });
      //   Cookies.set("supplierAccess", supplierAccess?.toString() || "0", { expires: 15 });
      //   Cookies.set("advanceAccess", advanceAccess?.toString() || "0", { expires: 15 });
      //   console.log("Approver Data:", responseData.data);
      //   if (approver != null && approver != undefined) {

      //     Cookies.set(

      //       "approver",

      //       `${approver?.FirstName || ""} ${approver?.LastName || ""}`.trim(),

      //       { expires: 15 }

      //     );

      //   }

      //   // ✅ Set Authorization Header
      //   setSession(access_token);

      //   // ✅ Update State
      //   dispatch({
      //     type: "LOGIN_SUCCESS",
      //     payload: {
      //       user: { name, email, id: userid },
      //       role: roleAccess || [100000],
      //       roleid: roleId,
      //       rolename: roleName,
      //       supplierAccess: supplierAccess ?? 0,
      //       advanceAccess: advanceAccess ?? 0,
      //     },
      //   });

      //   return true;
      // } else {
      //   toast.error(responseData.message || "Login failed");
      //   dispatch({
      //     type: "LOGIN_ERROR",
      //     payload: { errorMessage: responseData.message || "Login failed" },
      //   });
      //   return false;
      // }
    } catch (err) {
      console.error("Auth Provider Error:", err);
      dispatch({
        type: "LOGIN_ERROR",
        payload: { errorMessage: err.message || "Login failed" },
      });
      return false;
    }
  };

  // ✅ Logout Function
  const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("name");
    Cookies.remove("email");
    Cookies.remove("userid");
    Cookies.remove("role");
    Cookies.remove("roleid");
    Cookies.remove("rolename");
    Cookies.remove("supplierAccess");
    Cookies.remove("advanceAccess");
    Cookies.remove("approver");

    setSession(null);
    dispatch({ type: "LOGOUT" });
    window.location.href = "/clinic";
  };

  // ✅ Render Children After Init
  if (!state.isInitialized) return null;

  return (
    <AuthContext
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};