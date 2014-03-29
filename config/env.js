function set(name, value) {
  if (!(name in process.env)) {
    process.env[name] = value;
  }
}

// ---------------------- //
// --  Server Settings -- //
// ---------------------- //

set('NODE_ENV', 'development');

// The port for the HTTP server to listen on
set('PORT', 8000);