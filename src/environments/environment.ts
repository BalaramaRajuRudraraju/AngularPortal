// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  accountsApiUrl: 'http://34.241.175.223:8091/i4gorigin.accounts/',
  sellerApiUrl: 'http://34.241.175.223:8091/i4gorigin.seller/',
  buyerApiUrl: 'http://34.241.175.223:8091/i4gorigin.buyer/',
  accountsHost: 'http://localhost:4200',
  sellerHost: 'http://localhost:4501',
  buyerHost: 'http://localhost:4502',
  googleUrl: 'https://dev-898533.oktapreview.com/oauth2/v1/authorize?idp=0oadly8xj14QicQnW0h7&client_id=0oad6ogbcwjvKdF0d0h7&'
    + 'response_type=token&response_mode=fragment&scope=openid&redirect_uri=http://34.241.175.223:8080/accounts/&state=WM6D&nonce=YsG76jo'
};
