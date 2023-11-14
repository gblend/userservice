export default {
  '/users/delete/{id}': {
    delete: {
      tags: ['Admin'],
      description: 'Delete account',
      summary: 'delete account',
      operationId: 'deleteAccount',
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'The user id to delete the account',
          required: true,
          type: 'number',
          example: 123,
        },
      ],
      responses: {
        '200': {
          description: 'Delete account successful response',
          content: {
            'application/json': {
              example: {
                status: 'success',
                message: "John Doe's account deleted successfully",
                data: {},
              },
            },
          },
        },
        '404': {
          description: 'Disable account failed response',
          content: {
            'application/json': {
              example: {
                status: 'error',
                message: 'Request failed.',
                data: {
                  errors: [
                    'No resource found with id: 123',
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
};
