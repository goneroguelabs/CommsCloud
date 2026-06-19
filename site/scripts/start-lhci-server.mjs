import { spawn } from "node:child_process";

const child = spawn("npm", ["run", "start"], {
  env: {
    ...process.env,
    NEXT_PUBLIC_SITE_URL: "https://commscloud.com",
    VERCEL_ENV: "production",
  },
  shell: true,
  stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    child.kill(signal);
    process.exit(0);
  });
}

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
