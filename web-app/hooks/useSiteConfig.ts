import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { siteConfig as staticConfig } from "@/config/site";

/**
 * Hook para obtener la configuración del sitio desde Convex.
 * Si los datos aún no cargan o hay un error, retorna los valores por defecto.
 */
export function useSiteConfig() {
    const dynamicConfig = useQuery(api.siteConfig.get);

    const name = dynamicConfig?.performerName || staticConfig.name;
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    if (!dynamicConfig) {
        return {
            ...staticConfig,
            initials,
            isLoading: dynamicConfig === undefined,
        };
    }

    return {
        name,
        initials,
        tagline: dynamicConfig.tagline,
        description: dynamicConfig.metaDescription,
        bio: dynamicConfig.bio,
        profileImages: dynamicConfig.profileImages || [],
        links: {
            instagram: dynamicConfig.socialLinks.instagram || "",
            twitter: dynamicConfig.socialLinks.twitter || "",
            onlyfans: dynamicConfig.socialLinks.onlyfans || "",
            tiktok: dynamicConfig.socialLinks.tiktok || "",
        },
        email: dynamicConfig.contactEmail,
        colors: {
            primary: dynamicConfig.primaryColor,
            secondary: dynamicConfig.secondaryColor,
        },
        // Nuevos campos dinámicos
        locations: dynamicConfig.locations || ["Caracas"],
        weight: dynamicConfig.weight || "",
        schedule: dynamicConfig.schedule || { is24h: true, workingDays: [] },
        pricing: dynamicConfig.pricing || { h1: 0 },
        vesRate: dynamicConfig.vesRate || 0,
        taxiIncluded: dynamicConfig.taxiIncluded ?? false,
        paymentMethods: dynamicConfig.paymentMethods || [],
        services: dynamicConfig.services || [],
        targetAudience: dynamicConfig.targetAudience || ["Hombres"],
        activePromo: dynamicConfig.activePromo || { label: "", description: "", isActive: false },
        personalMessage: dynamicConfig.personalMessage || "",
        isLoading: false,
    };
}
