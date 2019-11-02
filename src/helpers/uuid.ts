import {v4 as uuid} from 'uuid';

export function generateImageName() {
    return uuid().replace(/-/g, '').toLowerCase()
}