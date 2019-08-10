export enum Eligible {
    /**
     * All students in the system.
     */
    ALL = 1,
    /**
     * All students sharing the same faculty/course/school
     */
    SCHOOL = 2,
    /**
     * All students at specific branch, Useful for universities having more than one branch.
     * Eg St Augustine -> Main and Tabora
     */
    BRANCH = 3,
    /**
     * For students in specific class only.
     */
    CLASS = 4,
    /**
     * Students living in the same residence
     */
    RESIDENCE = 5,
    /**
     * Students sharing the same year.
     */
    YEAR = 6,
    /**
     * Students sharing the same sex.
     */
    SEX = 7,
    /**
     * Students sharing the same program even if outside the college.
     * Can be useful for miss Pharmacy of all country.
     */
    PROGRAM = 8
}

export enum Duration {
    ONE_YEAR = 1,
    TWO_YEARS = 2,
    THREE_YEARS = 3,
    FOUR_YEARS = 4,
    FIVE_YEARS = 5,
    SIX_YEARS = 6
}

export enum States {
    /**
     * Normal and functioning well.
     */
    ACTIVE = 1,
    /**
     * Due to spam we can suspend account.
     */
    SUSPENDED = 2,
    /**
     * We have disabled account manually or by conditions.
     */
    DISABLED = 3,
    /**
     * This is when user chose his account to be deleted along side everything.
     * Ghost account takes place for all votes and opinions after that.
     */
    TO_BE_DELETED = 4,
}