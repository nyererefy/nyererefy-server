export const formatRegNo = (regNo: string) => {
    return regNo.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
};