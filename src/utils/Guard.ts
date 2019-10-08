import {AuthChecker} from "type-graphql";
import {TheContext} from "./TheContext";

export const Guard: AuthChecker<TheContext> = ({context: {req, res}}, _roles: string[]) => {
    // if (roles.includes(VERIFICATION_TOKEN)) {
    //     const key = req.cookies[TWO_FA_COOKIE_NAME];
    //     return !!key
    // }

    const accountId = req.session.accountId;

    if (!accountId) {
        //By default TypeGraphQL don't set 401 code.
        res.status(401);
    }

    return !!accountId;
};