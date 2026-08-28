export const filterByArchive = <T extends { payslip_id: string | null }>(
    data: T[] | undefined,
    archive: boolean,
): T[] | undefined => {
    if (!archive) {
        return data?.filter((item) => item.payslip_id === null);
    }
    return data;
};
