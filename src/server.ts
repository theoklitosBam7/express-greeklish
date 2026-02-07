import { createApp } from './app';

function start() {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  const port = Number(process.env.PORT || 7070);
  const host = process.env.HOST || '127.0.0.1';
  const www = process.env.WWW;
  const app = createApp({ staticRoot: www });
  if (www) {
    console.log(`serving ${www}`);
  }
  app.listen(port, host, () => console.log(`listening on http://${host}:${port}`));
}

export { start };
