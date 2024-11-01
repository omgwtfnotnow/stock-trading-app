import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(weekOfYear)

function getWeek(date: Date): number {
    console.log(date)
    dayjs(date).week()
    const onejan: Date = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
}

function getWeekRange(date: Date): { start: Date, end: Date } {
    const weekNumber: number = getWeek(date);
    const firstDayOfYear: Date = new Date(date.getFullYear(), 0, 1);
    const firstDayOfWeek: Date = new Date(firstDayOfYear.getTime() + (weekNumber - 1) * 7 * 86400000);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay() + 1);

    const lastDayOfWeek: Date = new Date(firstDayOfWeek.getTime() + 6 * 86400000);

    return { start: firstDayOfWeek, end: lastDayOfWeek };
}

export function getDateOfWeek(date: Date): { week: number, range: { start: Date, end: Date } } {
    const weekNumber: number = getWeek(date);
    const weekRange: { start: Date, end: Date } = getWeekRange(date);

    return { week: weekNumber, range: weekRange };
}

export function formatDate(date: string) {
    
    const parts = date.split("/"); 
    const rearrangedParts = [parts[2], parts[0], parts[1]]; 
    const newString = rearrangedParts.join("-"); 
    return newString; 
}
export const cutFormatDate= (date:string)=>
    {
        const result = date.split('T');
        
        return result[0];
    }