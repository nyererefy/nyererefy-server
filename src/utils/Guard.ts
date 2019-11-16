import {AuthChecker} from "type-graphql";
import {TheContext} from "./TheContext";
import {Role} from "./enums";
import {CURRENT_UNIVERSITY_MANAGER, CURRENT_USER, SAME_CLASS} from "./consts";

export const Guard: AuthChecker<TheContext> = ({context: {req, res}, root}, roles: string[]) => {
    if (roles.includes(Role.ADMIN)) {
        const adminId = req.session.adminId;

        if (!adminId) {
            res.status(401);
        }

        return !!adminId
    }

    if (roles.includes(Role.MANAGER)) {
        const managerId = req.session.managerId;

        if (!managerId) {
            res.status(401);
        }

        return !!managerId
    }

    //So this will only work for university entity.
    else if (roles.includes(CURRENT_UNIVERSITY_MANAGER)) {
        const managerId = req.session.managerId;
        const universityId = req.session.universityId;

        if (!managerId) {
            res.status(401);
        }

        return universityId === root.id && !!managerId;
    }

    //So this will only work for user entity.
    else if (roles.includes(CURRENT_USER)) {
        const studentId = req.session.studentId;

        return studentId === root.id;
    }

    //Only they share the same class.
    else if (roles.includes(SAME_CLASS)) {
        const classId = req.session.classId;

        return classId === root.class.id;
    }

    //Student is default role.
    else {
        const studentId = req.session.studentId;

        if (!studentId) {
            //By default TypeGraphQL don't set 401 code.
            res.status(401);
        }

        return !!studentId;
    }
};