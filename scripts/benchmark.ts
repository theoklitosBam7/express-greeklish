import { createApp } from '@/app';
import { greeklishService } from '@/services';

type BenchmarkOptions = {
  iterations: number;
  concurrency: number;
  text: string;
};

const parseInteger = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const printResults = (
  mode: 'http' | 'service',
  options: BenchmarkOptions,
  latencies: number[],
  totalElapsedMs: number
): void => {
  const min = Math.min(...latencies);
  const max = Math.max(...latencies);
  const avg = latencies.reduce((sum, value) => sum + value, 0) / latencies.length;
  const throughput = (options.iterations / totalElapsedMs) * 1000;

  console.log('Benchmark Results');
  console.log(`Mode: ${mode}`);
  console.log(`Iterations: ${options.iterations}`);
  console.log(`Concurrency: ${options.concurrency}`);
  console.log(`Average latency (ms): ${avg.toFixed(2)}`);
  console.log(`Min latency (ms): ${min.toFixed(2)}`);
  console.log(`Max latency (ms): ${max.toFixed(2)}`);
  console.log(`Throughput (req/s): ${throughput.toFixed(2)}`);
};

const runServiceBenchmark = async (options: BenchmarkOptions): Promise<void> => {
  const latencies: number[] = [];
  let completed = 0;
  const startedAt = process.hrtime.bigint();

  const runWorker = async (): Promise<void> => {
    while (completed < options.iterations) {
      completed += 1;
      const started = process.hrtime.bigint();
      greeklishService.convert(options.text);
      const elapsedMs = Number(process.hrtime.bigint() - started) / 1_000_000;
      latencies.push(elapsedMs);
    }
  };

  await Promise.all(Array.from({ length: options.concurrency }, () => runWorker()));
  const totalElapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
  printResults('service', options, latencies, totalElapsedMs);
};

const runHttpBenchmark = async (options: BenchmarkOptions): Promise<boolean> => {
  process.env.DISABLE_REQUEST_LOGS = '1';
  const app = createApp();
  let server: ReturnType<typeof app.listen>;
  let isListening = false;

  try {
    server = app.listen(0);

    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.once('listening', () => {
        isListening = true;
        resolve();
      });
    });

    const address = server.address();
    if (!address || typeof address === 'string') {
      return false;
    }

    const baseUrl = `http://127.0.0.1:${address.port}`;
    const endpoint = `${baseUrl}/api/v1/convert`;
    const latencies: number[] = [];
    let completed = 0;

    const runWorker = async (): Promise<void> => {
      while (completed < options.iterations) {
        completed += 1;
        const started = process.hrtime.bigint();

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ text: options.text }),
        });

        if (!response.ok) {
          throw new Error(`Benchmark request failed with status ${response.status}.`);
        }

        await response.arrayBuffer();
        const elapsedMs = Number(process.hrtime.bigint() - started) / 1_000_000;
        latencies.push(elapsedMs);
      }
    };

    const startedAt = process.hrtime.bigint();
    await Promise.all(Array.from({ length: options.concurrency }, () => runWorker()));
    const totalElapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    printResults('http', options, latencies, totalElapsedMs);
    return true;
  } catch {
    return false;
  } finally {
    if (isListening) {
      await new Promise<void>((resolve, reject) => {
        server.close((error: Error | undefined) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    }
  }
};

const iterations = parseInteger(process.env.BENCH_ITERATIONS, 40);
const concurrency = parseInteger(process.env.BENCH_CONCURRENCY, 4);
const text = process.env.BENCH_TEXT ?? 'Euhxo: autw pou akougetai wrea. H glwssa thelei poiotita.';

const run = async (): Promise<void> => {
  const httpWorked = await runHttpBenchmark({ iterations, concurrency, text });
  if (!httpWorked) {
    console.warn('HTTP benchmark mode is not available in this environment. Falling back to service mode.');
    await runServiceBenchmark({ iterations, concurrency, text });
  }
};

run().catch(error => {
  console.error(error);
  process.exit(1);
});
