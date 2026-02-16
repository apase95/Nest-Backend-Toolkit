

export const formatDisplayName = (
    firstName: string | undefined | null,
    lastName: string | undefined | null,
    email?: string
): string => {
    const parts = [firstName, lastName].filter(Boolean);

    if (parts.length > 0) {
        return parts.join(" ").trim();
    }

    if (email) {
        return email.split("@")[0];
    }

    return "Unknown User";
};