import { vi } from "vitest";
import { installGetBoundingClientRectShim } from "./get-bounding-client-rect-shim";

const kBrowserShimsInstalled = Symbol.for("test.runtime.browserShimsInstalled");

type WindowWithOptionalShims = Omit<
  Window,
  "matchMedia" | "ResizeObserver" | "IntersectionObserver"
> & {
  matchMedia?: (query: string) => MediaQueryList;
  ResizeObserver?: typeof ResizeObserver;
  IntersectionObserver?: typeof IntersectionObserver;
};

function getWindowObject(): WindowWithOptionalShims | undefined {
  if (globalThis.window === undefined) {
    return undefined;
  }

  return globalThis.window as WindowWithOptionalShims;
}

function installClipboardShim(): void {
  // Share/copy flows use Clipboard API; this provides a stable mock when JSDOM does not expose navigator.clipboard.
  if (globalThis.navigator === undefined || globalThis.navigator.clipboard) {
    return;
  }

  Object.defineProperty(globalThis.navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(""),
    },
  });
}

function installMatchMediaShim(): void {
  // MUI responsive hooks call matchMedia; this prevents crashes and keeps breakpoint behavior deterministic in tests.
  const windowObject = getWindowObject();

  if (windowObject === undefined || windowObject.matchMedia) {
    return;
  }

  Object.defineProperty(windowObject, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(() => false),
      }) as MediaQueryList,
  });
}

class ResizeObserverStub {
  observe() {
    return undefined;
  }

  unobserve() {
    return undefined;
  }

  disconnect() {
    return undefined;
  }
}

function installResizeObserverShim(): void {
  // Virtualized/table UI paths can require ResizeObserver; this avoids runtime errors in the test environment.
  const windowObject = getWindowObject();

  if (windowObject === undefined || windowObject.ResizeObserver) {
    return;
  }

  Object.defineProperty(windowObject, "ResizeObserver", {
    configurable: true,
    writable: true,
    value: ResizeObserverStub,
  });
}

class IntersectionObserverStub {
  readonly root: Element | Document | null = null;
  readonly rootMargin = "0px";
  readonly thresholds: ReadonlyArray<number> = [];

  disconnect() {
    return undefined;
  }

  observe() {
    return undefined;
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  unobserve() {
    return undefined;
  }
}

function installIntersectionObserverShim(): void {
  // Lazy-rendered and visibility-driven UI can depend on IntersectionObserver; this keeps those paths executable in JSDOM.
  const windowObject = getWindowObject();

  if (windowObject === undefined || windowObject.IntersectionObserver) {
    return;
  }

  Object.defineProperty(windowObject, "IntersectionObserver", {
    configurable: true,
    writable: true,
    value: IntersectionObserverStub,
  });
}

export function installBrowserShims(): void {
  const globalWithFlags = globalThis as typeof globalThis &
    Record<symbol, unknown>;

  if (globalWithFlags[kBrowserShimsInstalled]) {
    return;
  }

  // Layout anchor shim first so downstream component rendering has stable geometry.
  installGetBoundingClientRectShim();
  // Browser API shims follow to support copy, responsive UI, and observer-dependent components.
  installClipboardShim();
  installMatchMediaShim();
  installResizeObserverShim();
  installIntersectionObserverShim();

  Object.defineProperty(globalWithFlags, kBrowserShimsInstalled, {
    configurable: true,
    value: true,
  });
}
