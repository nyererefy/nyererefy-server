export enum Eligible {
    /**
     * All users in the UNIVERSITY.
     * If this and isExtended === true then this category is universal.
     */
    ALL = 1,

    /**
     * All users at specific branch, Useful for universities having more than one branch.
     * Eg St Augustine -> Main and Tabora
     */
    BRANCH = 2,

    /**
     * All users sharing the same faculty/course/school
     */
    SCHOOL = 3,

    /**
     * For users in specific class only.
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
     * Students sharing the same schoolPrograms even if outside the college.
     * Can be useful for miss Pharmacy of all country.
     */
    PROGRAM = 7,

    /**
     * If election is universal then all categories should also made universal
     */
    // UNIVERSAL = 0
}

/**
 * https://en.wikipedia.org/wiki/ISO/IEC_5218
 */
export enum Sex {
    MALE = 1,
    FEMALE = 2,
    OTHER = 0
}

export enum Duration {
    ONE_YEAR = 1,
    TWO_YEARS = 2,
    THREE_YEARS = 3,
    FOUR_YEARS = 4,
    FIVE_YEARS = 5,
    SIX_YEARS = 6
}

export enum Year {
    COMPLETED = 0,
    FIRST_YEAR = 1,
    SECOND_YEAR = 2,
    THIRD_YEAR = 3,
    FOURTH_YEAR = 4,
    FIFTH_YEAR = 5,
}

export enum State {
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

export enum Topic {
    VOTE_ADDED = 'vote_added',
    CANDIDATE_VOTE_ADDED = 'candidate_vote_added',
    SUBCATEGORY_VOTE_ADDED = 'subcategory_vote_added',
    REVIEW_ADDED = 'review_added'
}

export enum OrderBy {
    ASC = 'ASC',
    DESC = 'DESC'
}