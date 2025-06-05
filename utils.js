// js/utils.js
export function parseTimeToMinutes(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return Infinity;
    timeStr = timeStr.toLowerCase();
    let totalMinutes = 0;
    if (timeStr.includes('+')) timeStr = timeStr.split('+')[1]?.trim() || timeStr;
    if (timeStr.includes('overnight') || timeStr.includes('multi-day') || timeStr.includes('ferment')) {
        if (!timeStr.match(/\d+\s*hr/) && !timeStr.match(/\d+\s*min/)) return 9999;
    }
    const hourMatch = timeStr.match(/(\d+)\s*hr/);
    const minMatch = timeStr.match(/(\d+)\s*min/);
    if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
    if (minMatch) totalMinutes += parseInt(minMatch[1]);

    if (totalMinutes === 0 && timeStr.match(/\d+/)) {
        const simpleMinMatch = timeStr.match(/(\d+)/);
        if (simpleMinMatch) totalMinutes = parseInt(simpleMinMatch[1]);
    }
    return totalMinutes === 0 ? Infinity : totalMinutes;
}