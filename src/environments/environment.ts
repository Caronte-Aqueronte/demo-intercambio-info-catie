export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',

  //claims que se usan para guardar la sesion devuelta por el login, en el localstorage del cliemte
  tokenClaimName: 'token',
  roleClaimName: 'role',
  clientNameClaimName: 'name',
  userClaimId: 'userId',
};
