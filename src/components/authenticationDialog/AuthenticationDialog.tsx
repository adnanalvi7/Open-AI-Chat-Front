import { Button, Flex, Group, PinInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import {
  loginUser,
  resetPassword,
  sendOtpCode,
  singUpUser,
  verifyOtpCode,
} from "../../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/Auth";

export default function AuthenticationDialog({
  close,
  authType,
}: {
  close: () => void;
  authType: "" | "login" | "signup";
}) {
  const [type, setType] = useState<
    "login" | "signup" | "" | "forgotPassword" | "otp" | "resetPassword"
  >("");
  const {
    getTokenFromCookie,
    saveTokenToCookie,
    setLoading,
    loading,
    setUser,
    setIsAuthenticated,
    saveUserToCookie,
  } = useAuth();
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: {
      name: (value) =>
        type === "signup" && value.trim().length < 3
          ? "Name must be at least 3 characters long"
          : null,
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6
          ? null
          : "Password must be at least 6 characters long",
    },
  });

  useEffect(() => {
    if (authType) {
      setType(authType);
    } else {
      setType("");
    }
  }, [authType]);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const data = await loginUser(values.email, values.password);

      saveTokenToCookie(data.access_token);
      if (data.user) {
        if (data.user.password) {
          delete data.user.password;
        }
        setUser(data.user);
        saveUserToCookie(JSON.stringify(data.user));
        setIsAuthenticated(true);
      }
      toast.success("Login Successful!", { position: "top-right" });
      getTokenFromCookie();
      close();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login failed!", error);
      toast.error(error?.response?.data?.message || "Login failed", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);

    try {
      await singUpUser(values.name, values.email, values.password);

      toast.success("Signup Successful! Please log in.", {
        position: "top-right",
      });
      setType("login"); // Switch to login after signup
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Signup failed!", error);
      toast.error(error?.response?.data?.message || "Signup failed", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (forgotPasswordEmail.match(/^\S+@\S+\.\S+$/) === null) {
      return toast.error("Enter valid email!", {
        position: "top-right",
      });
    }
    setLoading(true);

    try {
      await sendOtpCode(forgotPasswordEmail);

      toast.success("Code sent.", {
        position: "top-right",
      });
      setType("otp"); // Switch to login after signup
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "failed", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyCode = async () => {
    setLoading(true);

    try {
      await verifyOtpCode(code, forgotPasswordEmail);

      toast.success("Code Verified.", {
        position: "top-right",
      });
      setType("resetPassword"); // Switch to login after signup
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "failed", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);

    try {
      await resetPassword(newPassword, forgotPasswordEmail);

      toast.success("Password updated.", {
        position: "top-right",
      });
      setType("login"); // Switch to login after signup
      setNewPassword("");
      setCode("");
      setForgotPasswordEmail("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "failed", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {type === "login" ? (
        <form onSubmit={form.onSubmit(handleLogin)}>
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
          <TextInput
            withAsterisk
            label="Password"
            placeholder="Enter Password"
            type="password"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
          <Group justify="space-between" mt="md">
            <Button
              variant="light"
              size="compact-sm"
              onClick={() => setType("forgotPassword")}
            >
              Forgot Password?
            </Button>
            <Button type="submit" loading={loading}>
              Log in
            </Button>
          </Group>
        </form>
      ) : type === "signup" ? (
        <form onSubmit={form.onSubmit(handleSignup)}>
          <TextInput
            withAsterisk
            label="Full Name"
            placeholder="John Doe"
            key={form.key("name")}
            {...form.getInputProps("name")}
          />
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />
          <TextInput
            withAsterisk
            label="Password"
            placeholder="Enter Password"
            type="password"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
          <Group justify="flex-end" mt="md">
            <Button loading={loading} type="submit">
              Sign up
            </Button>
          </Group>
        </form>
      ) : type === "forgotPassword" ? (
        <div>
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.currentTarget.value)}
          />

          <Group justify="flex-end" mt="md">
            <Button
              loading={loading}
              onClick={handleForgotPassword}
              type="submit"
            >
              Send Code
            </Button>
          </Group>
        </div>
      ) : type === "otp" ? (
        <div>
          <Group justify="flex-start" mb="md">
            <span className="text-lg font-bold">Enter Code</span>
          </Group>
          <Flex justify="center">
            <PinInput
              autoFocus
              value={code}
              onChange={(e) => setCode(e)}
              size="xl"
              length={6}
            />
          </Flex>

          <Group justify="flex-end" mt="md">
            <Button
              disabled={code.length !== 6}
              loading={loading}
              onClick={handleVerifyCode}
              type="submit"
            >
              Verify Code
            </Button>
          </Group>
        </div>
      ) : type === "resetPassword" ? (
        <div>
          <Flex direction={"column"}>
            <TextInput
              autoFocus
              value={newPassword}
              onChange={(e) => setNewPassword(e.currentTarget.value)}
              label="New Password"
              type="password"
            />
          </Flex>

          <Group justify="flex-end" mt="md">
            <Button
              disabled={newPassword.length < 6}
              loading={loading}
              onClick={handleResetPassword}
              type="submit"
            >
              Change Password
            </Button>
          </Group>
        </div>
      ) : (
        <Flex gap="md" align="center" direction="column">
          <h3 className="text-gray-700 font-bold font-Barlow text-base">
            Please log in / sign up to continue!
          </h3>
          <Flex mih={50} gap="md" align="center" direction="row" wrap="wrap">
            <Button variant="default" onClick={() => setType("login")}>
              Log in
            </Button>
            <Button variant="default" onClick={() => setType("signup")}>
              Sign up
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  );
}
