import { useAuthStore } from "../store/auth";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import { LoginCurve } from "iconsax-reactjs";

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
    <div className="min-h-[80vh] grid place-items-center bg-gradient-to-b from-brand-50 to-white">
      <Card className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="inline-grid place-items-center h-9 w-9 rounded-full bg-brand-100">
            <LoginCurve size={18} className="text-brand-700" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Welcome back</h1>
        </div>
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
              <Button type="submit" disabled={loading} aria-busy={loading} full>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
              <p className="mt-3 text-xs text-slate-500">
                Demo: <code>john@mail.com / changeme</code>
              </p>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}
