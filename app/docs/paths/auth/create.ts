export default {
  '/users/create': {
    post: {
      tags: ['User'],
      description: 'Create a new user',
      summary: 'creates a new user',
      operationId: 'signUp',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SignupInput',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'New user signup successful response',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SignupSuccess',
              },
            },
          },
        },
        '400': {
          description: 'New user signup error response',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SignupError',
              },
            },
          },
        },
      },
    },
  },
};
