export type Color = "tertiary" | "secondary" | "primary" | "blank";
export type ColorHex = "#1e5741" | "#7BC1DC" | "#FF8E3E";

export function getColor(location: Location, returnHex: boolean = false): Color | ColorHex {
    const searchParams = new URLSearchParams(location.search);
    const serviceType = searchParams.get("serviceType");

    // Check for serviceType in query params OR specific pathname conditions
    const isTaxonomicExpert = serviceType === "taxonomicExpert" || location.pathname.includes("/te");
    const isReferenceCollection = serviceType === "referenceCollection" || location.pathname.includes("/tc") || location.pathname.includes("/rf");

    if (returnHex) {
        if (isReferenceCollection) return "#1e5741";
        if (isTaxonomicExpert) return "#7BC1DC";
        return "#FF8E3E"; // Default primary color (hex)
    }

    if (isReferenceCollection) return "secondary";
    if (isTaxonomicExpert) return "tertiary";
    return "primary"; // Default primary class
}
