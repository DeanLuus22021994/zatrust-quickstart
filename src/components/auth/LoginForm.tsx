"use client";

type LoginFormProps = {
  from?: string;
};

export default function LoginForm({ from }: LoginFormProps) {
  return (
    <form action="/api/auth/login" method="post" style={{ maxWidth: 320 }}>
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
      <div id="username-help" style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
        Enter any username to continue
      </div>
      <div style={{ marginTop: 12 }}>
        <button type="submit">
          Login
        </button>
      </div>
    </form>
  );
}
