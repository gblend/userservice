export default {
  UpdateAccountInput: {
    type: 'object',
    properties: {
      firstname: {
        type: 'string',
        required: true,
        description: "User's firstname",
        example: 'John',
      },
      lastname: {
        type: 'string',
        required: true,
        description: "User's lastname",
        example: 'Doe',
      },
      roleId: {
        type: 'number',
        required: true,
        description: 'The user role id',
        example: '1',
      },
      email: {
        type: 'string',
        required: true,
        description: "User's email address",
        example: 'johndoe@example.com',
      },
    },
  },
};
