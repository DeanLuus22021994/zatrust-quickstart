'use client';

export default function LoginForm() {
  return (
    <form action="/api/auth/login" method="post" style={{ maxWidth: 320 }}>
      <label>
        Username
        <input name="username" placeholder="demo" required />
      </label>
      <div style={{ marginTop: 12 }}>
        <button type="submit">Login</button>
      </div>
    </form>
  );
}
