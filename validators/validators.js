import {body} from 'express-validator';

export const registerValidator = [
    body('email').isEmail(),
    body('password').isLength({min: 5}),
    body('fullName').isLength({min: 3}),
    body('avatar').optional().isURL()
]

export const loginValidator = [
    body('email').isEmail(),
    body('password').isLength({min: 5}),
]

export const postCreateValidator = [
    body('title', 'Enter title pls').isLength({min: 3}).isString(),
    body('text', 'Enter proper post text pls').isLength({min: 10}).isString(),
    body('tags', 'incorrect format of tags (indicate an array)!').optional().isArray(),
    body('imageUrl', 'Incorrect link for image!').optional().isString()
]

// export const commentCreateValidator = [
//     body('user', 'Enter user pls').isLength({min: 3}).isString(),
//     body('text', 'Enter proper comment text pls').isLength({min: 3}).isString(),
// ]
