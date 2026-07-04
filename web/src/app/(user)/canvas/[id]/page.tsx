import { Suspense } from "react";
import CanvasClientPage from "./canvas-client-page";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function CanvasPage() {
    return (
        <Suspense fallback={<main className="flex h-full items-center justify-center bg-background text-sm text-stone-500">Loading canvas...</main>}>
            <CanvasClientPage />
        </Suspense>
    );
}
