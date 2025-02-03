import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { loginUser, singUpUser } from "../../api/Api";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function AuthenticationDialog({ close }: { close: () => void }) {
  const [type, setType] = useState("");

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

  // ✅ Function to store token in cache with expiration time
  // Function to save token to cookies
  const saveTokenToCookie = (token: string) => {
    const expirationTime = new Date(
      new Date().getTime() + 60 * 60 * 1000
    ).toUTCString(); // Expires in 1 hour
    document.cookie = `authToken=${token}; expires=${expirationTime}; path=/; Secure; HttpOnly`;
    console.log(document.cookie, "qqqqqqqqqqqqqqqq");
  };

  // Function to retrieve token from cookies
  const getTokenFromCookie = () => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "__session") {
        console.log(value, "valuevaluevaluevaluevaluevalue");

        return value;
      }
    }
    return null;
  };

  // Function to remove token from cookies (if needed)
  const removeTokenFromCookie = () => {
    document.cookie = `authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // Remove expired token on component mount
  useEffect(() => {
    removeTokenFromCookie();
  }, []);

  // ✅ Handle Login Function
  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const data = await loginUser(values.email, values.password);
      console.log("🎉 Logged in user:", data);

      // Save token in session storage cache
      saveTokenToCookie(data.token);

      toast.success("✅ Login Successful!", { position: "top-right" });
      getTokenFromCookie();
      close();
    } catch (error: any) {
      console.error("❌ Login failed!", error);
      toast.error(error?.response?.data?.message || "Login failed", {
        position: "top-right",
      });
    }
  };

  // Handle Signup Function
  const handleSignup = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const data = await singUpUser(values.name, values.email, values.password);
      console.log("🎉 Signed up user:", data);
      toast.success("✅ Signup Successful! Please log in.", {
        position: "top-right",
      });
      setType("login"); // Switch to login after signup
    } catch (error: any) {
      console.error("❌ Signup failed!", error);
      toast.error(error?.response?.data?.message || "Signup failed", {
        position: "top-right",
      });
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
          <Group justify="flex-end" mt="md">
            <Button type="submit">Log in</Button>
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
            <Button type="submit">Sign up</Button>
          </Group>
        </form>
      ) : (
        <Group justify="center">
          <h3 className="text-gray-700 font-bold font-Barlow text-base">
            Please log in / sign up to continue!
          </h3>
          <Button variant="default" onClick={() => setType("login")}>
            Log in
          </Button>
          <Button variant="default" onClick={() => setType("signup")}>
            Sign up
          </Button>
        </Group>
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}
