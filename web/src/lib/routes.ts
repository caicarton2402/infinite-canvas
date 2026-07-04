export const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export function canvasProjectHref(projectId: string, params?: URLSearchParams | string) {
    const query = new URLSearchParams(typeof params === "string" ? params : params?.toString());

    if (isStaticExport) {
        query.set("projectId", projectId);
        return `/canvas?${query.toString()}`;
    }

    const queryString = query.toString();
    return `/canvas/${projectId}${queryString ? `?${queryString}` : ""}`;
}
