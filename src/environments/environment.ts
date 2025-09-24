export const environment = {
  production: false,
  apiUrl: 'http://104.238.140.30:8181/api',

  //claims que se usan para guardar la sesion devuelta por el login, en el localstorage del cliemte
  tokenClaimName: 'token',
  roleClaimName: 'role',
  clientNameClaimName: 'name',
  userClaimId: 'userId',
};
