import {AuthChecker} from "type-graphql";
import {TheContext} from "./TheContext";
import {Role} from "./enums";

export const Guard: AuthChecker<TheContext> = ({context: {req, res}}, roles: string[]) => {
    if (roles.includes(Role.MANAGER)) {
        const managerId = req.session.managerId;

        if (!managerId) {
            res.status(401);
        }
        return !!managerId
    }

    const studentId = req.session.studentId;

    if (!studentId) {
        //By default TypeGraphQL don't set 401 code.
        res.status(401);
    }

    return !!studentId;
};