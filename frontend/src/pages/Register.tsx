import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Register = () => {
  const navigate = useNavigate();

  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      await api.post("/auth/register/", {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      setError("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-lg">
        
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Create an account
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Input
            placeholder="Username"
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button onClick={handleRegister} className="w-full">
            Register
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <span
              className="text-primary cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>

        </CardContent>
      </Card>
    </div>
  );
};

export default Register;