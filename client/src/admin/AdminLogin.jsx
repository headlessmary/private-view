import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Save token
      localStorage.setItem("adminToken", data.token);

      // Save admin
      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

      navigate("/admin/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="
      min-h-screen
      bg-black
      flex
      items-center
      justify-center
      px-5
    "
    >
      <div className="w-full max-w-md">
        {/* Header */}

        <div className="text-center mb-10">
          <p
            className="
            uppercase
            tracking-[0.45em]
            text-[#d4a24d]
            text-xs
            font-semibold
          "
          >
            Staff Access
          </p>

          <h1
            className="
            mt-4
            font-serif
            text-[#d4a24d]
            text-4xl
            sm:text-5xl
          "
          >
            Sign In
          </h1>

          <p
            className="
            mt-3
            text-gray-400
            text-sm
          "
          >
            Admin dashboard & check-in tools.
          </p>
        </div>

        {/* Login Card */}

        <div
          className="
          bg-[#0b0907]
          border
          border-[#22170a]
          rounded-2xl
          p-6
          sm:p-8
          shadow-[0_0_60px_rgba(0,0,0,.5)]
        "
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email */}

            <div>
              <label
                className="
                block
                uppercase
                tracking-[0.35em]
                text-[#d4a24d]
                text-xs
                mb-3
                font-semibold
              "
              >
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="
                  w-full
                  h-14
                  rounded-lg
                  bg-[#19130d]
                  border
                  border-[#1d1409]
                  px-5
                  text-white
                  outline-none
                  focus:border-[#d4a24d]
                  transition
                "
              />
            </div>

            {/* Password */}

            <div>
              <label
                className="
                block
                uppercase
                tracking-[0.35em]
                text-[#d4a24d]
                text-xs
                mb-3
                font-semibold
              "
              >
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="
                  w-full
                  h-14
                  rounded-lg
                  bg-[#19130d]
                  border
                  border-[#1d1409]
                  px-5
                  text-white
                  outline-none
                  focus:border-[#d4a24d]
                  transition
                "
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-900/30 border border-red-700 p-4 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Button */}

            <button
              disabled={loading}
              type="submit"
              className="
                w-full
                h-14
                rounded-lg
                uppercase
                tracking-[0.45em]
                text-sm
                font-semibold
                text-black
                bg-linear-to-r
                from-[#f1d08b]
                via-[#e4a321]
                to-[#f2cd84]
                hover:brightness-110
                transition
                disabled:opacity-50
              "
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p
            className="
            text-center
            text-gray-500
            text-sm
            mt-6
          "
          >
            Private View Admin Portal
          </p>
        </div>
      </div>
    </section>
  );
}