import { useAuthStore } from "../store/auth";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { useLocation, useNavigate } from "react-router-dom";

const Schema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(4, "Too short").required("Required"),
});

export default function Login() {
  const { login, loading, error } = useAuthStore();
  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state as any)?.from?.pathname || "/";

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white p-6 rounded-2xl shadow">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>
      <Formik
        initialValues={{ email: "john@mail.com", password: "changeme" }}
        validationSchema={Schema}
        onSubmit={async (v) => {
          const ok = await login(v.email, v.password);
          if (ok) nav(from, { replace: true });
        }}
      >
        {({ errors, touched, handleChange, values }) => (
          <Form noValidate>
            <Field
              id="email"
              label="Email"
              value={values.email}
              onChange={handleChange}
              error={touched.email ? errors.email : undefined}
            />
            <Field
              id="password"
              label="Password"
              type="password"
              value={values.password}
              onChange={handleChange}
              error={touched.password ? errors.password : undefined}
            />
            {error && (
              <div role="alert" className="text-sm text-red-600 mb-2">
                {error}
              </div>
            )}
            <Button type="submit" disabled={loading} aria-busy={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </Form>
        )}
      </Formik>
      <p className="mt-3 text-xs text-slate-500">
        Use: <code>john@mail.com / changeme</code>
      </p>
    </div>
  );
}
