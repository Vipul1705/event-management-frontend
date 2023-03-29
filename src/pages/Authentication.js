import { json, redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import axios from "axios";
function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";
  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Unsupported mode" }, { status: 422 });
  }
  const data = await request.formData();
  const authData = JSON.stringify({
    email: data.get("email"),
    password: data.get("password"),
  });

  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8080/" + mode,
    headers: {
      "Content-Type": "application/json",
    },
    data: authData,
  };
  const response = await axios(config);

  if (response.status === 422 || response.status === 401) {
    return response;
  }
  if (response.statusText !== "OK" && response.statusText !== "Created") {
    throw json({ message: "Could not authenticate user" }, { status: 500 });
  }

  localStorage.setItem("token", response.data.token);
  return redirect("/");
}
