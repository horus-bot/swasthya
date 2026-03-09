"use client";

import { DependencyList, RefObject, useEffect, useRef } from "react";
import gsap from "gsap";

export function useGsapContext<T extends Element>(
  scopeRef: RefObject<T | null>,
  setup: () => void,
  deps: DependencyList = []
) {
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useEffect(() => {
    const scope = scopeRef.current;

    if (!scope) {
      return;
    }

    const ctx = gsap.context(() => {
      setupRef.current();
    }, scope);

    return () => ctx.revert();
  }, [scopeRef, ...deps]);
}