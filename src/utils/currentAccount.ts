import {createParamDecorator} from "type-graphql";
import {TheContext} from "./TheContext";

export function CurrentStudent(): ParameterDecorator {
    return createParamDecorator<TheContext>(({context}) => {
        return context.req.session.studentId;
    });
}

export function CurrentManager(): ParameterDecorator {
    return createParamDecorator<TheContext>(({context}) => {
        return context.req.session.managerId;
    });
}

export function CurrentUniversity(): ParameterDecorator {
    return createParamDecorator<TheContext>(({context}) => {
        return context.req.session.universityId;
    });
}