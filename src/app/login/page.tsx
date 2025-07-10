"use client";
import React, { useState } from "react";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Checkbox,
  Alert,
  Spinner,
} from "@heroui/react";
import {
  LockClosedIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/src/provider/Auth.provider";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onShowForgotPassword: () => void;
}

export default function LoginForm({ onShowForgotPassword }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(formData.username, formData.password);
      if (!success) {
        setError("Invalid username or password");
      } else {
        console.log("Login successful");
        router.push("/home");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center gap-6 items-center">
          <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <LockClosedIcon className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center">
            Welcome Back
          </h2>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardBody className="space-y-5">
            {error && <Alert className="text-sm">{error}</Alert>}

            <Input
              label="Username"
              endContent={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter your username"
              required
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your password"
              required
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <Checkbox>Remember me </Checkbox>
              <button
                type="button"
                onClick={onShowForgotPassword}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </CardBody>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" disabled={isLoading} fullWidth>
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Spinner size="sm" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </Button>

            <p className="text-sm text-center text-gray-600">
              Demo credentials:{" "}
              <span className="font-medium">superadmin / admin / user</span>{" "}
              with password: <span className="font-medium">password123</span> or{" "}
              <span className="font-medium">admin123</span>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
