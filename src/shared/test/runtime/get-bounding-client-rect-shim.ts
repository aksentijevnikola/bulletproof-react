const kPatchedGetBoundingClientRect = Symbol.for(
  "test.runtime.patchedGetBoundingClientRect",
);

type RectShape = {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
};

const nonZeroRect: RectShape = {
  x: 0,
  y: 0,
  width: 1,
  height: 1,
  top: 0,
  left: 0,
  right: 1,
  bottom: 1,
};

function isFullyZeroRect(rect: DOMRect): boolean {
  return (
    rect.x === 0 &&
    rect.y === 0 &&
    rect.width === 0 &&
    rect.height === 0 &&
    rect.top === 0 &&
    rect.left === 0 &&
    rect.right === 0 &&
    rect.bottom === 0
  );
}

function createNonZeroRect(): DOMRect {
  return {
    ...nonZeroRect,
    toJSON: () => ({ ...nonZeroRect }),
  } as DOMRect;
}

export function installGetBoundingClientRectShim(): void {
  // MUI popover/menu positioning reads layout rects; JSDOM returns zero rects, so this keeps anchored overlays deterministic in tests.
  if (typeof HTMLElement === "undefined") {
    return;
  }

  const prototype = HTMLElement.prototype as unknown as {
    getBoundingClientRect: (this: HTMLElement) => DOMRect;
  } & Record<symbol, unknown>;

  if (prototype[kPatchedGetBoundingClientRect]) {
    return;
  }

  const nativeGetBoundingClientRect = prototype.getBoundingClientRect;

  Object.defineProperty(prototype, "getBoundingClientRect", {
    configurable: true,
    value: function patchedGetBoundingClientRect(this: HTMLElement): DOMRect {
      const rect = nativeGetBoundingClientRect.call(this);

      if (!this.isConnected || !isFullyZeroRect(rect)) {
        return rect;
      }

      return createNonZeroRect();
    },
  });

  Object.defineProperty(prototype, kPatchedGetBoundingClientRect, {
    configurable: true,
    value: true,
  });
}
