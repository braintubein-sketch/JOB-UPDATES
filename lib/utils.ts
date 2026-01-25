export function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date));
}

export function generateSlug(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

export function truncate(text: string, length: number) {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
}
