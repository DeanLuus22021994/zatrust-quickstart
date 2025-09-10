"use client";

type LoginFormProps = {
  from?: string;
};

export default function LoginForm({ from }: LoginFormProps) {
  return (
    <form action="/api/auth/login" method="post" className="login-form">
      {from && <input type="hidden" name="from" value={from} />}
      <label htmlFor="username">
        Username
        <input
          id="username"
          name="username"
          placeholder="demo"
          required
          aria-describedby="username-help"
        />
      </label>
      <div id="username-help" className="login-help">
        Enter any username to continue
      </div>
      <div className="login-actions">
        <button type="submit">Login</button>
      </div>
    </form>
  );
}
