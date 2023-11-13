import {capitalizeFirstCharacter} from '../../app/lib/utils';

describe('CapitalizeFirstCharacter', () => {
    it('should return null when input is null', () => {
        const input = null;

        expect(capitalizeFirstCharacter(input)[0]).toEqual(input);
    });

    it('should return undefined when input is undefined', () => {
        const input = undefined;

        expect(capitalizeFirstCharacter(input)[0]).toEqual(input);
    });

    it('should return output with first character capitalized', () => {
        const input = 'userService';

        expect(capitalizeFirstCharacter(input)[0]).toEqual('UserService');
    });

    it('should return output with each first character capitalized with 2 input', () => {
        const input = 'user';
        const input2 = 'Service';
        const res = capitalizeFirstCharacter(input, input2);

        expect(res[0]).toEqual('User');
        expect(res[1]).toEqual('Service');
    });

    it('should return first character capitalized when input is a single character', () => {
        const input = 'a';

        expect(capitalizeFirstCharacter(input)[0]).toEqual(input.toLocaleUpperCase());
    });
});
