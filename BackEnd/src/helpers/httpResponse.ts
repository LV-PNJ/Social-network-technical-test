interface ResponseType {
  statusMessage: string;
  statusDescription: string;
}

type ResponsesTypes = {
  [code: string]: ResponseType;
};

export const responsesTypes: ResponsesTypes = {
  '200': { statusMessage: 'OK', statusDescription: 'Request succeeded without error' },
  '201': { statusMessage: 'Created', statusDescription: 'Resource created' },
  '202': { statusMessage: 'Accepted', statusDescription: 'Request accepted' },
  '204': { statusMessage: 'No Content', statusDescription: 'Resource has no content' },
  '301': { statusMessage: 'Moved Permanently', statusDescription: 'Resource has been permanently moved' },
  '302': { statusMessage: 'Found', statusDescription: 'Resource was found under another URI' },
  '304': { statusMessage: 'Not Modified', statusDescription: 'Resource has not been modified' },
  '400': { statusMessage: 'Bad Request', statusDescription: 'Request is invalid, missing parameters?' },
  '401': { statusMessage: 'Unauthorized', statusDescription: "User isn't authorized to access this resource" },
  '402': { statusMessage: 'Payment Required', statusDescription: 'This code is reserved for future use.' },
  '403': { statusMessage: 'Forbidden', statusDescription: 'The server understood the request but refuses to authorize it' },
  '404': { statusMessage: 'Not Found', statusDescription: 'The requested resource was not found on the server' },
  '405': { statusMessage: 'Method not allowed', statusDescription: 'The HTTP method used is not allowed' },
  '406': { statusMessage: 'Not Acceptable', statusDescription: 'The target resource does not have a current representation that would be acceptable to the user agent' },
  '409': { statusMessage: 'Conflict', statusDescription: 'Request has caused a conflict' },
  '413': { statusMessage: 'Request Entity Too Large', statusDescription: 'The webserver or proxy believes the request is too large' },
  '422': { statusMessage: 'Data body incorrect', statusDescription: 'Some data is incorrect' },
  '429': { statusMessage: 'Too Many Requests', statusDescription: 'Too many requests issue within a period' },
  '500': { statusMessage: 'Server Error', statusDescription: 'An error occurred on the server' },
  '501': { statusMessage: 'Method Not Implemented', statusDescription: "The requested method / resource isn't implemented on the server" },
  '502': { statusMessage: 'Connection Refused', statusDescription: 'The connection to server was refused' },
  '503': { statusMessage: 'Service Unavailable', statusDescription: 'The server is currently unable to handle the request due to a temporary overloading or maintenance of the server' }
};
