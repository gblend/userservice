import joi, {ValidationResult} from 'joi';
import {IUser} from '../../interface';

class UserValidator{
    validateCreateUserDto (userDto: IUser): ValidationResult {
        const user = joi.object({
            firstname: joi.string().min(3).required(),
            lastname: joi.string().min(3).required(),
            email: joi.string().email().required(),
            roleId: joi.number().required(),
            password: joi.string().min(8).required(),
            passwordConfirmation: joi.string().valid(joi.ref('password')).required(),
        });

        return user.validate(userDto);
    }

    validateUpdateUserDto (updateUserDto: IUser): ValidationResult {
        const userUpdate = joi.object({
            firstname: joi.string().min(3),
            lastname: joi.string().min(3),
            email: joi.string().email(),
            roleId: joi.number(),
            id: joi.number(),
        });

        return userUpdate.validate(updateUserDto);
    };

    validateLoginDto (loginDto: IUser): ValidationResult {
        const login = joi.object({
            email: joi.string().email().required(),
            password: joi.string().min(8).required(),
        });

        return login.validate(loginDto);
    };

    validateVerifyUserDto (verifyEmailDto: {email: string, token: string}): ValidationResult {
        const verifyDto = joi.object({
            email: joi.string().email().required(),
            token: joi.string().required(),
        });

        return verifyDto.validate(verifyEmailDto);
    };
}

export const userValidator: UserValidator = new UserValidator();