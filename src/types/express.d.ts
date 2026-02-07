declare namespace Express {
  interface Locals {
    requestId?: string;
    startedAtNs?: bigint;
  }
}
